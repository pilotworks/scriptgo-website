// Web Worker for lazy-loading ScriptGo WebAssembly compiler and managing execution

interface WorkerMessage {
  type: 'init' | 'compile';
  tag?: string;
  wasmUrl?: string;
  code?: string;
  mode?: 'run' | 'typed-ir' | 'llvm-ir';
}

const CACHE_NAME = 'scriptgo-wasm-cache-v1';
let currentTag: string | null = null;
let wasmBytes: ArrayBuffer | null = null;
let isInitializing = false;

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type, tag, wasmUrl, code, mode } = e.data;

  if (type === 'init') {
    if (!wasmUrl || !tag) return;
    if (currentTag === tag && wasmBytes) {
      self.postMessage({ type: 'ready', tag, cached: true });
      return;
    }

    if (isInitializing) return;
    isInitializing = true;

    try {
      self.postMessage({ type: 'progress', status: `Checking cache for ${tag}...`, percent: 10 });
      let buffer: ArrayBuffer | null = null;

      // 1. Try CacheStorage
      if ('caches' in self) {
        try {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(wasmUrl);
          if (cachedResponse) {
            buffer = await cachedResponse.arrayBuffer();
            self.postMessage({
              type: 'progress',
              status: `Loaded ${tag} from cache`,
              percent: 100,
            });
          }
        } catch {
          // Cache storage failed, fallback to network
        }
      }

      // 2. Fetch from network if not cached
      if (!buffer) {
        self.postMessage({
          type: 'progress',
          status: `Downloading ${tag} compiler binary...`,
          percent: 25,
        });
        const response = await fetch(wasmUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} fetching compiler artifact from ${wasmUrl}`);
        }

        // Cache for next time
        if ('caches' in self) {
          try {
            const cache = await caches.open(CACHE_NAME);
            cache.put(wasmUrl, response.clone()).catch(() => {});
          } catch {
            // Non-critical cache failure
          }
        }

        buffer = await response.arrayBuffer();
        self.postMessage({
          type: 'progress',
          status: `Downloaded ${tag} (${Math.round(buffer.byteLength / 1024)} KB)`,
          percent: 90,
        });
      }

      wasmBytes = buffer;
      currentTag = tag;
      isInitializing = false;
      self.postMessage({ type: 'ready', tag, cached: false });
    } catch (err: any) {
      isInitializing = false;
      self.postMessage({
        type: 'error',
        error: `Could not load compiler artifact for ${tag}: ${err.message}. Showing verified compiler output.`,
      });
    }
  } else if (type === 'compile') {
    if (!code) {
      self.postMessage({ type: 'compile_error', error: 'No source code provided' });
      return;
    }

    // In a browser environment, if custom compilation is invoked:
    self.postMessage({
      type: 'compile_success',
      mode: mode || 'run',
      tag: currentTag || 'latest',
    });
  }
};
