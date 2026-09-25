export interface ParityFeature {
  name: string;
  category: string;
  tier: 'Tier 1 (AOT Native)' | 'Tier 2 (Dynamic Island)' | 'Unsupported';
  status: 'Full' | 'Partial' | 'Unsupported';
  notes: string;
}

export const parityCategories = [
  'All',
  'Node.js Core',
  'Types & Primitives',
  'Control Flow',
  'Functions & Closures',
  'OOP & Classes',
  'Web Standards',
];

export const parityFeatures: ParityFeature[] = [
  // Node.js Core
  {
    name: 'node:path',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (16/16 APIs): basename, delimiter, dirname, extname, format, isAbsolute, join, matchesGlob, normalize, parse, posix, relative, resolve, sep, toNamespacedPath, win32',
  },
  {
    name: 'node:url',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (46/46 APIs): URL, URLSearchParams, URLPattern, Url, parse, format, resolve, resolveObject, fileURLToPath, pathToFileURL, urlToHttpOptions, domainToASCII, domainToUnicode, searchParams methods',
  },
  {
    name: 'node:os',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (23/23 APIs): arch, availableParallelism, constants, cpus, devNull, endianness, EOL, freemem, getPriority, setPriority, homedir, hostname, loadavg, machine, networkInterfaces, platform, release, tmpdir, totalmem, type, uptime, userInfo, version',
  },
  {
    name: 'node:util',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (67/67 APIs): format, formatWithOptions, inspect, promisify, callbackify, deprecate, isDeepStrictEqual, types (all 39 type predicates), parseArgs, parseEnv, styleText, stripVTControlCharacters, toUSVString, getSystemErrorName/Map/Message, MIMEType, MIMEParams, TextEncoder, TextDecoder',
  },
  {
    name: 'node:http',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (142/142 APIs): complete HTTP client & server suite across Agent (12), ClientRequest (30), Server (15), IncomingMessage (29), OutgoingMessage (25), ServerResponse (20), and all top-level functions/constants',
  },
  {
    name: 'node:net',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Server, Socket, SocketAddress, connect, createConnection, createServer, isIP, isIPv4, isIPv6, TCP_NODELAY, SO_KEEPALIVE, [Symbol.asyncDispose]',
  },
  {
    name: 'node:fs',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Synchronous and asynchronous file operations, fs.promises.*, FileHandle, Stats, StatFs, Dir, Dirent, streams (createReadStream, createWriteStream), and FSWatcher',
  },
  {
    name: 'node:crypto',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'createHash (sha256, sha512, sha1, md5), createHmac, randomBytes, randomUUID, timingSafeEqual, pbkdf2Sync, subtle crypto API backed by OpenSSL',
  },
  {
    name: 'node:buffer',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Buffer.alloc, allocUnsafe, from (utf8, hex, base64), slice, subarray, all 14 binary BE/LE readers/writers, Blob, File, atob, btoa',
  },
  {
    name: 'node:sqlite',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (32/32 APIs): DatabaseSync, StatementSync, Session, backup, constants, prepare, exec, run, get, all, iterate, columns, [Symbol.dispose]',
  },
  {
    name: 'node:process',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'argv, env, exit, cwd, pid, platform, arch, hrtime, hrtime.bigint, stdout, stderr, uptime, process events',
  },
  {
    name: 'node:events',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (69/69 APIs): EventEmitter (on, once, emit, off, removeListener, listenerCount, eventNames), EventEmitterAsyncResource, NodeEventTarget, Event, CustomEvent',
  },
  {
    name: 'node:stream',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (15/15 APIs): Readable, Writable, Duplex, Transform, PassThrough, pipeline, finished, compose, stream/promises, stream/consumers, WHATWG stream adapters',
  },
  {
    name: 'node:zlib',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (53/53 APIs): deflate, gzip, gunzip, inflate, brotli, zstd, streaming transform classes and factory functions',
  },
  {
    name: 'node:child_process',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (26/26 APIs): spawn, exec, execFile, fork, execFileSync, execSync, spawnSync, ChildProcess with streaming stdio pipes',
  },
  {
    name: 'node:assert',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (27/27 APIs): assert, ok, equal, strictEqual, deepStrictEqual, throws, doesNotThrow, rejects, doesNotReject, AssertionError, CallTracker',
  },
  {
    name: 'node:readline',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (30/30 APIs): Interface, createInterface, cursor management, ANSI escape sequences, readline/promises API',
  },
  {
    name: 'node:tty',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      '100% verified parity (16/16 APIs): isatty, ReadStream (isRaw, setRawMode), WriteStream (columns, rows, cursorTo, moveCursor, clearLine), color depth',
  },

  // Types & Primitives
  {
    name: 'number (IEEE-754 64-bit)',
    category: 'Types & Primitives',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Direct unboxed double-precision float in CPU registers; NaN, Infinity, -0 compliant',
  },
  {
    name: 'bigint (64-bit signed)',
    category: 'Types & Primitives',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: '100n syntax, arithmetic, bitwise operators, BigInt(...), BigInt64Array support',
  },
  {
    name: 'string (UTF-8 immutable)',
    category: 'Types & Primitives',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Zero-overhead slices, automatic reference counting, template strings, unicode-safe',
  },
  {
    name: 'boolean, null, undefined',
    category: 'Types & Primitives',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: '1-bit LLVM i1 for boolean; tagged nullish representation with ?. and ?? operators',
  },
  {
    name: 'symbol & Symbol Registry',
    category: 'Types & Primitives',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Symbol(), Symbol.for(), Symbol.keyFor(), Symbol.iterator, Symbol.dispose, Symbol.asyncDispose',
  },
  {
    name: 'unknown & Type Narrowing',
    category: 'Types & Primitives',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Canonical 24-byte boxed ABI v1; flow-sensitive typeof / isArray / instanceof unboxing',
  },
  {
    name: 'Union Types (T | U)',
    category: 'Types & Primitives',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Multi-variant primitive & object unions; flow unboxing into CPU registers for zero-overhead loops',
  },
  {
    name: 'Generics (Monomorphized)',
    category: 'Types & Primitives',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Ahead-of-Time static specialization per concrete type parameter, 0 boxing overhead',
  },
  {
    name: 'ES2024 Set Methods',
    category: 'Types & Primitives',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'union, intersection, difference, symmetricDifference, isSubsetOf, isSupersetOf, isDisjointFrom',
  },
  {
    name: 'RegExp (POSIX Hardened)',
    category: 'Types & Primitives',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Hardened POSIX extended regex runtime: non-capturing groups (?:...), capture group index mapping, undefined sentinel propagation for optional groups',
  },
  {
    name: 'any',
    category: 'Types & Primitives',
    tier: 'Tier 2 (Dynamic Island)',
    status: 'Partial',
    notes:
      'Compile error in static mode (SG1001); with --dynamic, lowers through boxed unknown representation',
  },

  // Control Flow
  {
    name: 'Loops & Iteration',
    category: 'Control Flow',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'while, do..while, for, for..of, for..in, for await..of over async iterables',
  },
  {
    name: 'Labeled Statements',
    category: 'Control Flow',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'break label and continue label across deeply nested loop scopes into LLVM branch blocks',
  },
  {
    name: 'Exceptions (try/catch/finally)',
    category: 'Control Flow',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Native setjmp/longjmp unwinding with guaranteed finally execution and Error stack capture',
  },
  {
    name: 'Destructuring (Nested & Rest)',
    category: 'Control Flow',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Multi-level object and array destructuring with default fallbacks and rest parameters',
  },
  {
    name: 'using / await using (TS 5.2)',
    category: 'Control Flow',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Deterministic LIFO scope disposal invoking [Symbol.dispose]() and [Symbol.asyncDispose]()',
  },

  // Functions & Closures
  {
    name: 'Closures & Lexical Scopes',
    category: 'Functions & Closures',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Heap-allocated environment contexts for captured variables; zero-cost for uncaptured locals',
  },
  {
    name: 'Generators (function*)',
    category: 'Functions & Closures',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Compiler state-machine lowering yielding IteratorResult<T>, full for..of integration',
  },
  {
    name: 'Async Generators',
    category: 'Functions & Closures',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'AsyncIterator with Promise queueing, for await..of integration',
  },

  // OOP & Classes
  {
    name: 'Classes & Inheritance',
    category: 'OOP & Classes',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'extends, super(), static fields, class static blocks static { ... }, polymorphic VTables',
  },
  {
    name: 'Getters & Setters',
    category: 'OOP & Classes',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Accessor methods compiled to direct function calls without property lookup overhead',
  },
  {
    name: 'instanceof & Type Guards',
    category: 'OOP & Classes',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'VTable prototype chain traversal in native machine code',
  },

  // Web Standards
  {
    name: 'fetch() & WHATWG Fetch',
    category: 'Web Standards',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'WHATWG Fetch standard compliance: Headers, Request, Response, .text(), .json(), .arrayBuffer(), .blob(), .bytes(), .formData(), Response.json/error/redirect, clone(), ReadableStream',
  },
  {
    name: 'WHATWG FormData',
    category: 'Web Standards',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Complete FormData with IterableIterator protocol, entries/keys/values, for..of & Array.from support, multipart/form-data & urlencoded body decoders',
  },
  {
    name: 'WHATWG URLPattern',
    category: 'Web Standards',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Web Standard / WinterCG pattern matching across 8 URL components, named captures (:id), wildcards (*), optional tokens (:param?), regex constraints (:id(\\d+)), test(), exec()',
  },
  {
    name: 'WebSocket (RFC 6455)',
    category: 'Web Standards',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Native RFC 6455 client engine with frame masking, ping/pong, CloseEvent/MessageEvent',
  },
  {
    name: 'URL & URLSearchParams',
    category: 'Web Standards',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Full WHATWG URL parser and search parameters manipulation (100% Node v22 specification parity)',
  },
  {
    name: 'TextEncoder / TextDecoder',
    category: 'Web Standards',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Fast streaming UTF-8 encoding and decoding',
  },

  // Non-Goals / Unsupported
  {
    name: 'eval() & new Function()',
    category: 'Control Flow',
    tier: 'Unsupported',
    status: 'Unsupported',
    notes:
      'AOT non-goal. Compiling dynamic strings at runtime requires bundling a full compiler/JIT',
  },
  {
    name: 'Runtime prototype modification',
    category: 'OOP & Classes',
    tier: 'Unsupported',
    status: 'Unsupported',
    notes:
      'AOT classes use static polymorphic VTables. Monkey-patching Object.prototype at runtime is rejected',
  },
];
