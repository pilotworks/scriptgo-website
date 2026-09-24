# Standard Library & Web APIs

ScriptGo provides a built-in standard library implementing essential Node.js APIs and WinterCG web standards backed directly by high-performance native C libraries and system calls.

## The 4-tier model

ScriptGo organizes runtime APIs into four explicit compatibility tiers:

| Tier                         | Namespace / APIs                                                                                                                                                         | Module Import Required?          | Source of Truth                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ------------------------------------------ |
| **1. ECMAScript Runtime**    | `Math`, `JSON`, `Promise`, `Date`, `Map`, `Set`, `WeakMap`, `WeakSet`, `Symbol`, `ArrayBuffer`, `DataView`, `BigInt`, `Int8Array`..`Float64Array`, `Error`, `RegExp`     | No (Global Scope)                | **ECMAScript 2024 (ES15)**                 |
| **2. WHATWG Web Standards**  | `fetch`, `Headers`, `Request`, `Response`, `URL`, `URLSearchParams`, `TextEncoder`, `TextDecoder`, `AbortController`, `AbortSignal`, `queueMicrotask`, `structuredClone` | No (Global Scope)                | **WinterCG** / WHATWG living standard      |
| **3. Node Globals**          | `process`, `Buffer`, `console`, `setImmediate`, `clearImmediate`, `__dirname`, `__filename`                                                                              | No (Global Scope)                | **Node.js 22 LTS** globals test suite      |
| **4. Node Built-in Modules** | `node:fs`, `node:path`, `node:crypto`, `node:buffer`, `node:sqlite`, `node:os`, `node:process`, `node:events`                                                            | Yes (`import ... from 'node:*'`) | **Node.js 22 LTS** `test/parallel/` suites |

**Scope note:** ScriptGo is a native systems and backend compiler designed for servers, CLI utilities, and high-performance WebAssembly services. It intentionally excludes browser DOM APIs, CSS parsing, and UI rendering.

## Node.js core modules

ScriptGo implements high-performance native versions of essential Node.js APIs backed directly by native C libraries and system calls:

- `node:fs`: Synchronous and asynchronous file I/O operations (`readFile`, `writeFile`, `existsSync`, `stat`, `mkdir`, `readdir`, `unlink`).
- `node:path`: POSIX and Windows path manipulation (`join`, `resolve`, `dirname`, `basename`, `extname`, `normalize`).
- `node:crypto`: Native cryptographic hashing (SHA-256, SHA-512, MD5 via OpenSSL/BoringSSL), secure random numbers (`randomBytes`, `randomUUID`), and constant-time comparisons (`timingSafeEqual`).
- `node:buffer`: Native byte buffers with slicing, hex/base64 transcoding, and raw memory access (`Buffer.from`, `Buffer.alloc`).
- `node:sqlite`: High-throughput embedded SQLite database engine with zero external daemon or driver setup.
- `node:process` & `node:os`: Command-line arguments (`argv`), environment variables (`env`), CPU core counts, platform architecture, and exit codes.

## Web standards (WinterCG)

Modern server applications rely heavily on standard fetch and streaming primitives. ScriptGo natively supports:

```ts
import fs from 'node:fs';
import crypto from 'node:crypto';

// 1. High-speed native cryptographic hash
const hash = crypto.createHash('sha256').update('scriptgo-compiler').digest('hex');
console.log(`SHA-256: ${hash}`);

// 2. Direct filesystem write (zero V8 heap overhead)
fs.writeFileSync('output.txt', `Compiled with ScriptGo AOT at ${new Date().toISOString()}`);

// 3. Streaming HTTP Fetch conforming to WinterCG standards
const response = await fetch('https://api.github.com/repos/pilotworks/scriptgo');
const repo = (await response.json()) as {
  full_name: string;
  stargazers_count: number;
  description: string;
};

console.log(`Repository: ${repo.full_name}`);
console.log(`Stars: ${repo.stargazers_count}`);
console.log(`Summary: ${repo.description}`);
```
