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
    notes: 'join, resolve, normalize, dirname, basename, extname, parse, format, posix, win32',
  },
  {
    name: 'node:fs',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'readFileSync, writeFileSync, existsSync, statSync, readdirSync, mkdirSync, appendFileSync, promises API',
  },
  {
    name: 'node:crypto',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'createHash (sha256, sha512, md5), randomBytes, randomUUID, subtle crypto API',
  },
  {
    name: 'node:buffer',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Buffer.alloc, allocUnsafe, from (utf8, hex, base64), slice, subarray, all binary BE/LE readers/writers',
  },
  {
    name: 'node:os',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'platform, arch, cpus, totalmem, freemem, homedir, tmpdir, hostname, uptime',
  },
  {
    name: 'node:process',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'argv, env, exit, cwd, pid, platform, arch, hrtime, hrtime.bigint, stdout, stderr',
  },
  {
    name: 'node:events',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'EventEmitter: on, once, emit, off, removeListener, listenerCount, eventNames',
  },
  {
    name: 'node:stream',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Readable, Writable, Transform, pipeline, stream/promises API, WHATWG stream adapters',
  },
  {
    name: 'node:http & node:net',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Native TCP/HTTP server and client socket connections, chunked transfer encoding, header parser',
  },
  {
    name: 'node:sqlite',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes:
      'Native embedded SQLite engine: DatabaseSync, prepare, exec, run, get, all statement queries',
  },
  {
    name: 'node:child_process',
    category: 'Node.js Core',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'execSync, spawnSync, spawn with stdio pipes (graceful degradation on WASI targets)',
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
    name: 'fetch() & WHATWG Streams',
    category: 'Web Standards',
    tier: 'Tier 1 (AOT Native)',
    status: 'Full',
    notes: 'Streaming HTTP fetch, ReadableStream, WritableStream, TransformStream, stream piping',
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
    notes: 'Full WHATWG URL parser and search parameters manipulation',
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
