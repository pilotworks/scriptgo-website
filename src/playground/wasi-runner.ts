import { Fd, File, OpenFile, PreopenDirectory, WASI } from '@bjorn3/browser_wasi_shim';

class MemoryPipeStdout extends Fd {
  private onWrite: (chunk: string) => void;
  private decoder = new TextDecoder('utf-8');

  constructor(onWrite: (chunk: string) => void) {
    super();
    this.onWrite = onWrite;
  }

  fd_write(view8: Uint8Array, iovs: Array<{ buf: number; buf_len: number }>) {
    let bytesWritten = 0;
    for (const iov of iovs) {
      const chunk = view8.subarray(iov.buf, iov.buf + iov.buf_len);
      this.onWrite(this.decoder.decode(chunk, { stream: true }));
      bytesWritten += iov.buf_len;
    }
    return { ret: 0, nwritten: bytesWritten };
  }
}

export interface WasiRunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
  exitCode: number;
}

export async function runWasmModule(
  wasmBytes: Uint8Array,
  args: string[] = ['app.wasm'],
  env: string[] = ['RUST_BACKTRACE=1', 'TERM=xterm-256color', 'SCRIPTGO_WASI=1'],
  onStdout?: (chunk: string) => void,
  onStderr?: (chunk: string) => void
): Promise<WasiRunResult> {
  let stdoutAccum = '';
  let stderrAccum = '';

  const stdoutFd = new MemoryPipeStdout((chunk) => {
    stdoutAccum += chunk;
    if (onStdout) onStdout(chunk);
  });

  const stderrFd = new MemoryPipeStdout((chunk) => {
    stderrAccum += chunk;
    if (onStderr) onStderr(chunk);
  });

  const fds = [
    new OpenFile(new File([])), // stdin (0)
    stdoutFd, // stdout (1)
    stderrFd, // stderr (2)
    new PreopenDirectory('/', new Map()),
  ];

  const wasi = new WASI(args, env, fds);
  const start = performance.now();
  let exitCode = 0;

  try {
    const compiled = await WebAssembly.compile(wasmBytes as any);
    const instance = await WebAssembly.instantiate(compiled, {
      wasi_snapshot_preview1: wasi.wasiImport,
    });

    try {
      exitCode = wasi.start(instance);
    } catch (err: any) {
      if (err && typeof err.code === 'number') {
        exitCode = err.code;
      } else if (err && err.name === 'WASIProcExit') {
        exitCode = err.code || 0;
      } else {
        throw err;
      }
    }

    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    return {
      success: exitCode === 0,
      stdout: stdoutAccum,
      stderr: stderrAccum,
      durationMs,
      exitCode,
    };
  } catch (err: any) {
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    return {
      success: false,
      stdout: stdoutAccum,
      stderr: (stderrAccum ? stderrAccum + '\n' : '') + (err?.message || String(err)),
      durationMs,
      exitCode: exitCode || 1,
    };
  }
}
