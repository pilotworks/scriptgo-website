import { Benchmarks } from '../components/benchmarks';
import { Playground } from '../components/playground';

# ScriptGo

ScriptGo is an Ahead-Of-Time (AOT) compiler that compiles **TypeScript directly to standalone native executables** and WebAssembly. It embeds Microsoft's official TypeScript-Go compiler frontend for 100% type-checking parity, couples it to an independent SSA Typed IR optimizer, and lowers directly to LLVM IR and machine code.

<Benchmarks />

## Why ScriptGo?

ScriptGo is engineered for production workloads where startup latency, memory footprint, and deployment simplicity are paramount:

- **Sub-1.5ms Cold Starts:** Compiles directly to ELF, Mach-O, and PE machine code. Zero JavaScript bytecode parsing, zero JIT warm-up, and zero interpreter initialization latency.
- **Microsecond Memory Footprints (&lt;6MB RSS):** Avoids multi-generational tracing garbage collection pauses. Primitives map to unboxed hardware registers, while escape analysis and temporary object regions reclaim short-lived memory with zero runtime overhead.
- **Microsoft TypeScript-Go Frontend:** Uses Microsoft's pinned TypeScript-Go compiler frontend. Guarantees 100% specification compliance for lexical scope, type checking, union narrowing, and module resolution without maintaining a custom parser.
- **Autonomous npm Package Manager:** Integrated zero-copy package manager resolves, verifies, and links dependencies with cryptographic SRI hashes directly from `https://registry.npmjs.org` without Node.js or external package tools.
- **Embedded C Runtime:** Links a minimal, high-performance C runtime implementing the ECMAScript microtask event loop, WHATWG `fetch`, Web standard streams, and Node.js standard library modules.

<Playground />
