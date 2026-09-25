# Standard Library & Web APIs

ScriptGo provides a built-in standard library implementing essential Node.js APIs and WinterCG web standards backed directly by high-performance native C libraries and system calls.

## The 4-tier model

ScriptGo organizes runtime APIs into four explicit compatibility tiers:

| Tier                         | Namespace / APIs                                                                                                                                                                             | Module Import Required?          | Source of Truth                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------ |
| **1. ECMAScript Runtime**    | `Math`, `JSON`, `Promise`, `Date`, `Map`, `Set`, `WeakMap`, `WeakSet`, `Symbol`, `ArrayBuffer`, `DataView`, `BigInt`, `Int8Array`..`Float64Array`, `Error`, `RegExp`                         | No (Global Scope)                | **ECMAScript 2024 (ES15)**                 |
| **2. WHATWG Web Standards**  | `fetch`, `Headers`, `Request`, `Response`, `FormData`, `URLPattern`, `URL`, `URLSearchParams`, `TextEncoder`, `TextDecoder`, `AbortController`, `AbortSignal`, `queueMicrotask`, `WebSocket` | No (Global Scope)                | **WinterCG** / WHATWG living standard      |
| **3. Node Globals**          | `process`, `Buffer`, `console`, `setImmediate`, `clearImmediate`, `__dirname`, `__filename`                                                                                                  | No (Global Scope)                | **Node.js 22 LTS** globals test suite      |
| **4. Node Built-in Modules** | `node:path`, `node:url`, `node:os`, `node:util`, `node:http`, `node:fs`, `node:crypto`, `node:buffer`, `node:sqlite`, `node:net`, `node:events`, `node:zlib`, `node:child_process`           | Yes (`import ... from 'node:*'`) | **Node.js 22 LTS** `test/parallel/` suites |

**Scope note:** ScriptGo is a native systems and backend compiler designed for servers, CLI utilities, and high-performance WebAssembly services. It intentionally excludes browser DOM APIs, CSS parsing, and UI rendering.

---

## 100% Parity Node modules

ScriptGo achieves **100% verified specification parity** across five fundamental Node.js core modules, thoroughly validated against Node.js v22 test suites on macOS and Linux:

### `node:path` (16 / 16 APIs — 100% Parity)

Full POSIX and Windows path manipulation backed by native C path normalization:

- **Functions:** `basename`, `delimiter`, `dirname`, `extname`, `format`, `isAbsolute`, `join`, `matchesGlob`, `normalize`, `parse`, `posix`, `relative`, `resolve`, `sep`, `toNamespacedPath`, `win32`.

```ts
import path from 'node:path';

const resolved = path.resolve('src', '..', 'dist', 'bundle.js');
const parsed = path.parse(resolved);
console.log(`Dir: ${parsed.dir}, Base: ${parsed.base}, Ext: ${parsed.ext}`);
console.log(`Is absolute: ${path.isAbsolute(resolved)}`);
console.log(`Glob match: ${path.matchesGlob('src/index.ts', '**/*.ts')}`);
```

### `node:url` (46 / 46 APIs — 100% Parity)

Complete WHATWG and Node.js URL parser and resolution suite:

- **Constructors:** `URL`, `URLSearchParams`, `URLPattern`, `Url`.
- **Utilities:** `parse`, `format`, `resolve`, `resolveObject`, `fileURLToPath`, `pathToFileURL`, `urlToHttpOptions`, `domainToASCII`, `domainToUnicode`.
- **Instance Methods & Properties:** All standard properties (`href`, `origin`, `protocol`, `username`, `password`, `host`, `hostname`, `port`, `pathname`, `search`, `hash`, `searchParams`), `toString()`, `toJSON()`, `canParse()`, and all `URLSearchParams` iterator and mutation methods (`append`, `delete`, `get`, `getAll`, `has`, `set`, `sort`, `size`, `entries`, `keys`, `values`).

```ts
import { URL, URLSearchParams, fileURLToPath } from 'node:url';

const myUrl = new URL('https://example.com:8080/api/v1/users?page=1&sort=desc#profile');
console.log(`Hostname: ${myUrl.hostname}, Port: ${myUrl.port}`);
console.log(`Param page: ${myUrl.searchParams.get('page')}`);

const localPath = fileURLToPath('file:///usr/local/bin/scriptgo');
console.log(`Local file path: ${localPath}`);
```

### `node:os` (23 / 23 APIs — 100% Parity)

Native operating system telemetry and resource inspection backed directly by native C system calls (`sysctl`, `sysconf`, `getifaddrs`, `getpriority`/`setpriority`, `getpwuid`, `gethostname`, `getloadavg`):

- **System Telemetry:** `arch()`, `platform()`, `type()`, `release()`, `version()`, `machine()`, `endianness()`, `EOL`, `devNull`.
- **Hardware & CPU:** `cpus()`, `availableParallelism()`, `totalmem()`, `freemem()`, `loadavg()`, `uptime()`.
- **Environment & Users:** `homedir()`, `tmpdir()`, `hostname()`, `userInfo()`, `networkInterfaces()`.
- **Process Priority & Constants:** `getPriority()`, `setPriority()`, `constants`.

```ts
import os from 'node:os';

console.log(`OS: ${os.type()} ${os.release()} (${os.arch()})`);
console.log(`CPU cores: ${os.cpus().length} (Parallelism: ${os.availableParallelism()})`);
console.log(
  `Memory: ${(os.freemem() / 1024 / 1024).toFixed(0)}MB free / ${(os.totalmem() / 1024 / 1024).toFixed(0)}MB total`
);
console.log(`Home directory: ${os.homedir()}`);
```

### `node:util` (67 / 67 APIs — 100% Parity)

Complete utility suite, CLI argument parser, and runtime type predicates:

- **Formatting & Inspection:** `format()`, `formatWithOptions()`, `inspect()`, `styleText()`, `stripVTControlCharacters()`, `toUSVString()`.
- **Async & Callback Bridges:** `promisify()`, `callbackify()`, `deprecate()`.
- **Deep Equality:** `isDeepStrictEqual()` with real recursive structural comparison.
- **CLI & Environment:** `parseArgs()`, `parseEnv()`.
- **Error Reflection:** `getSystemErrorName()`, `getSystemErrorMessage()`, `getSystemErrorMap()`.
- **Type Reflection (`util.types`):** All 39 standard type predicates (`isDate`, `isRegExp`, `isNativeError`, `isArrayBuffer`, `isUint8Array`, `isMap`, `isSet`, `isDataView`, `isPromise`, `isAsyncFunction`, `isBoxedPrimitive`, etc.).
- **MIME & Encoders:** `MIMEType`, `MIMEParams`, `TextEncoder`, `TextDecoder`, `_extend`, `aborted`, `transferableAbortSignal`, `transferableAbortController`.

```ts
import util from 'node:util';

const formatted = util.format('User %s has %d points (active: %s)', 'Alice', 42, true);
console.log(formatted);

const args = util.parseArgs({
  args: ['--port', '8080', '--verbose'],
  options: {
    port: { type: 'string', short: 'p' },
    verbose: { type: 'boolean', default: false },
  },
});
console.log(`Parsed port: ${args.values.port}`);
console.log(`Is Date: ${util.types.isDate(new Date())}`);
```

### `node:http` (142 / 142 APIs — 100% Parity)

High-performance native HTTP client and server architecture matching Node.js v22 specification across all core classes:

- **Core Classes:**
  - `Server` (15 APIs): `listen`, `close`, `closeAllConnections`, `closeIdleConnections`, `setTimeout`, etc.
  - `ServerResponse` (20 APIs): `writeHead`, `setHeader`, `getHeader`, `hasHeader`, `removeHeader`, `end`, `write`, `statusCode`, `statusMessage`.
  - `IncomingMessage` (29 APIs): `headers`, `rawHeaders`, `method`, `url`, `statusCode`, `statusMessage`, streaming body reader.
  - `ClientRequest` (30 APIs): `write`, `end`, `abort`, `setHeader`, `getHeader`, `getRawHeaderNames`, timeout management.
  - `OutgoingMessage` (25 APIs): shared header manipulation, chunk queuing, flushing.
  - `Agent` (12 APIs) & `globalAgent`: connection reuse, keep-alive pool.
- **Top-Level APIs & Constants:** `createServer()`, `request()`, `get()`, `validateHeaderName()`, `validateHeaderValue()`, `setMaxIdleHTTPParsers()`, `METHODS`, `STATUS_CODES`, `maxHeaderSize`.

```ts
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello from ScriptGo native HTTP server!', path: req.url }));
});

server.listen(3000, () => {
  console.log('HTTP Server listening on http://localhost:3000');
  server.close();
});
```

---

## Web standards (WinterCG)

ScriptGo prioritizes standard modern web APIs defined by WHATWG and WinterCG, ensuring seamless portability between native backend services, edge workers, and standard web clients:

```ts
// Global Web Standards available without imports
const encoder = new TextEncoder();
const bytes = encoder.encode('Hello Web Standards');

const controller = new AbortController();
const timeoutSignal = AbortSignal.timeout(5000);
```

---

## WHATWG Fetch and FormData

ScriptGo implements the complete WHATWG Fetch specification (`fetch`, `Headers`, `Request`, `Response`) and WHATWG `FormData` directly in native machine code:

### WHATWG Fetch Request & Response

- **Full Body Decoders:** `.text()`, `.json()`, `.arrayBuffer()`, `.blob()`, `.bytes()`, and `.formData()`.
- **Static Constructors:** `Response.json(data, init?)`, `Response.error()`, `Response.redirect(url, status?)`.
- **Request / Response Clones:** `.clone()` creates an independent fork of the request or response with stream bifurcation.
- **Streaming Bodies:** Backed by native `ReadableStream` conforming to WHATWG Streams specification.

```ts
// Making an outbound HTTP request
const res = await fetch('https://api.github.com/repos/pilotworks/scriptgo');
const data = (await res.json()) as { name: string; stargazers_count: number };
console.log(`Repository: ${data.name}`);

// Creating standard Response objects
const apiResponse = Response.json(
  { status: 'ok', timestamp: Date.now() },
  {
    status: 200,
    headers: { 'X-Powered-By': 'ScriptGo-Native' },
  }
);
console.log(await apiResponse.text());
```

### WHATWG FormData

- **Complete Standard Method Suite:** `append()`, `delete()`, `get()`, `getAll()`, `has()`, `set()`, `forEach()`, `entries()`, `keys()`, `values()`.
- **Iterator Protocol:** Implements ECMAScript `IterableIterator<T>` protocol, enabling native `for..of` iteration and `Array.from()` consumption.
- **Multipart / URL Encoded Bodies:** Automatic boundary generation when passed as `fetch()` or `Request` body, and full streaming parsing via `Response.prototype.formData()`.

```ts
const form = new FormData();
form.append('username', 'pilot');
form.append('role', 'admin');
form.append('tags', 'compiler');
form.append('tags', 'llvm');

console.log(`Username: ${form.get('username')}`);
console.log(`Tags:`, form.getAll('tags'));

// Iterable with for..of
for (const [key, value] of form) {
  console.log(`${key}: ${value}`);
}

// Convert entries to array or object
const entries = Array.from(form.entries());
```

---

## WHATWG URLPattern

ScriptGo provides a high-performance Web Standard and WinterCG compliant `URLPattern` matching engine available globally (`new URLPattern(...)`) and exported in `node:url` and `node:urlpattern`:

- **All 8 URL Components:** Pattern matches across `protocol`, `username`, `password`, `hostname`, `port`, `pathname`, `search`, and `hash`.
- **Pattern Syntax:**
  - Named parameter captures: `/users/:id`
  - Wildcard segments: `/static/*`
  - Optional segments & groups: `/posts/:id?`, `{-:version}?`
  - Regex constraints: `/:orderId(\\d+)`
- **Hardened Native POSIX Regex:** Enhanced POSIX regex runtime supporting non-capturing groups `(?:...)`, accurate capture group indexing, and `undefined` sentinel propagation for unmatched optional capture groups.
- **Input Resolution:** Accepts both URL pattern strings and `URLPatternInput` dictionary options, with full `baseURL` resolution.

```ts
import { URLPattern } from 'node:url';

// 1. Create a pattern matching API routes with typed constraint
const pattern = new URLPattern({
  pathname: '/api/v1/orders/:orderId(\\d+)/:action?',
});

// 2. Test URL against pattern
console.log(pattern.test('https://example.com/api/v1/orders/1042/refund')); // true
console.log(pattern.test('https://example.com/api/v1/orders/invalid')); // false

// 3. Extract matched parameters
const match = pattern.exec('https://example.com/api/v1/orders/1042/refund');
if (match) {
  console.log(`Order ID: ${match.pathname.groups.orderId}`); // "1042"
  console.log(`Action: ${match.pathname.groups.action}`); // "refund"
}
```
