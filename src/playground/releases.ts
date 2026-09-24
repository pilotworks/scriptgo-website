export interface ReleaseInfo {
  tag: string;
  name: string;
  publishedAt: string;
  wasmUrl: string;
  isLatest: boolean;
}

export const FALLBACK_RELEASES: string[] = [
  'v0.1.0-alpha.6',
  'v0.1.0-alpha.5',
  'v0.1.0-alpha.4',
  'v0.1.0-alpha.3',
  'v0.1.0-alpha.2',
  'v0.1.0-alpha.1',
];

const CACHE_KEY = 'scriptgo_releases_cache_v1';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function getReleases(): Promise<ReleaseInfo[]> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (
        Date.now() - parsed.timestamp < CACHE_TTL_MS &&
        Array.isArray(parsed.releases) &&
        parsed.releases.length > 0
      ) {
        return parsed.releases;
      }
    }
  } catch {
    // Ignore localStorage read errors
  }

  try {
    const response = await fetch('https://api.github.com/repos/pilotworks/scriptgo/releases', {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const releases: ReleaseInfo[] = data.map((r: any, idx: number) => {
          const wasmAsset = r.assets?.find(
            (a: any) => a.name?.endsWith('.wasm') || a.name === 'scriptgo.wasm'
          );
          return {
            tag: r.tag_name || r.name,
            name: r.name || r.tag_name,
            publishedAt: r.published_at ? new Date(r.published_at).toLocaleDateString() : '',
            wasmUrl: wasmAsset
              ? wasmAsset.browser_download_url
              : `https://github.com/pilotworks/scriptgo/releases/download/${r.tag_name}/scriptgo.wasm`,
            isLatest: idx === 0,
          };
        });

        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              releases,
            })
          );
        } catch {
          // Ignore localStorage write quota errors
        }

        return releases;
      }
    }
  } catch {
    // Network or rate-limit failure; fall through to built-in list
  }

  // Fallback to verified local tags
  return FALLBACK_RELEASES.map((tag, idx) => ({
    tag,
    name: tag,
    publishedAt: '2026-09',
    wasmUrl: `https://github.com/pilotworks/scriptgo/releases/download/${tag}/scriptgo.wasm`,
    isLatest: idx === 0,
  }));
}
