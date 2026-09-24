# npm dependencies

ScriptGo features an integrated, high-performance package manager designed according to the core principles of **pnpm** and **Bun**. It interacts directly with the npm registry (`https://registry.npmjs.org`) to manage dependencies with zero external Node.js tooling.

## Zero-copy package manager

Traditional package managers copy thousands of duplicate files into nested `node_modules/` directories across every project on disk. ScriptGo eliminates redundant disk I/O through a 6-stage execution pipeline:

```text
package.json / CLI
  │
  ▼
1. Metadata Resolution ────► npm Registry API (abbreviated JSON: application/vnd.npm.install-v1+json)
  │
  ▼
2. Dependency Graph ───────► SemVer Solver & Cycle Detection
  │
  ▼
3. CAS Cache Check ────────► ~/.scriptgo/store/ (Content-Addressable Storage)
  │ (on cache miss)
  ▼
4. Network Fetcher ────────► Concurrent HTTP/2 Pool + Streaming SHA-512 SRI verification
  │
  ▼
5. Storage & Link Engine ──► OS Copy-on-Write (macOS clonefile / Linux FICLONE) or hardlinks
  │
  ▼
6. Bins Projection ────────► node_modules/.bin links & shims
  │
  ▼
node_modules/ + scriptgo-lock.json
```

Core CLI workflow:

```sh
# Install all dependencies declared in package.json
scriptgo install

# Add or remove specific packages
scriptgo add lodash-es
scriptgo remove lodash-es
```

## Supply-chain safety

- **Phantom Dependency Prevention:** Dependencies are isolated using strict nested hardlinks. Code in your application can never accidentally import an undeclared transitive package that happened to be hoisted into the root.
- **Deterministic Lockfile:** Generates and enforces reproducible `scriptgo-lock.json` manifests containing cryptographic SHA-512 Subresource Integrity (SRI) hashes.
- **Zero Lifecycle Execution:** Lifecycle scripts (such as `preinstall`, `postinstall`, `install`) and arbitrary binary C addons are **never executed automatically** during installation. This eliminates the primary attack vector for malicious npm supply-chain compromises.
- **AOT vs Dynamic Execution:** Pure TypeScript and statically typed ESM packages compile directly to native machine instructions. Packages relying on dynamic JavaScript features execute seamlessly when compiled with `--dynamic`.
