# Limitations

ScriptGo is an Ahead-Of-Time (AOT) native compiler producing standalone machine code, not an interpreted VM or JIT runtime. To deliver sub-1.5ms instant startup, tiny binaries (&lt;5MB), and maximum execution speed, certain dynamic JavaScript behaviors are deliberately restricted in Static mode.

## AOT design rationale

Traditional JavaScript runtimes (like Node.js, V8, or SpiderMonkey) rely on speculative JIT compilation with deoptimization loops:

- **V8 / Node.js JIT model:** V8 executes bytecode in an interpreter (Ignition) while collecting runtime type feedback. When code becomes hot, the optimizing compiler (Turbofan) generates machine code under speculative assumptions (e.g. assuming an argument is always a 31-bit integer). If an assumption is violated at runtime, Turbofan invalidates the compiled machine code and bails out to the interpreter. This requires keeping an interpreter, a JIT compiler, dynamic hidden class transitions, inline caches, and a heavy tracing garbage collector in memory (>30MB baseline RAM).
- **ScriptGo AOT native model:** ScriptGo compiles TypeScript directly to target machine code (Mach-O, ELF, PE, WASI). Because static binaries contain **no embedded JavaScript interpreter or JIT engine**, runtime deoptimization bailouts are physically impossible. Therefore, memory layouts, types, and method calls must be statically provable at compile time. In exchange, ScriptGo delivers instant startup (&lt;1.5ms), predictable sub-millisecond tail latency, and tiny binaries (&lt;5MB) that run with zero external dependencies.

## Type system fences

In Static mode, ScriptGo enforces strict type soundness to guarantee safe machine register allocation and deterministic memory offsets:

| Construct                  | Status              | Technical Rationale & Resolution                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unconstrained `any`**    | Rejected (`SG1001`) | In LLVM IR, every SSA value requires a concrete type (e.g. `double` for 64-bit IEEE float, `i64` for integers/pointers, or struct pointer with fixed byte offsets). An unconstrained `any` variable has unknown size, unknown alignment, and unknown destructor semantics. **Resolution:** Specify a concrete interface, narrow with `typeof`/`instanceof`, or pass `--dynamic` to enable the 24-byte boxed ABI. |
| **Unchecked `unknown`**    | Gated (`SG1006`)    | `unknown` is the type-safe counterpart of `any`. It cannot be used in arithmetic, string concatenation, or member access without a preceding static type narrowing check or explicit checked cast. **Resolution:** Narrow with `if (typeof x === 'string')` before performing operations.                                                                                                                        |
| **Unproven Unions**        | Gated (`SG1002`)    | Accessing properties across union variants (`A \| B`) without checking a discriminant tag requires dynamic dispatch. **Resolution:** Narrow variants with discriminant properties (e.g. `shape.kind === 'circle'`) or `switch` statements before member access.                                                                                                                                                  |
| **Unspecialized Generics** | Gated (`SG1003`)    | Generics are monomorphized (specialized) into concrete struct layouts and function signatures at compile time. Open, unconstrained generic types cannot cross compilation boundaries without concrete layout instantiation. **Resolution:** Provide explicit type arguments or constrain generic parameters to concrete interfaces.                                                                              |

## Restricted dynamic features

Certain dynamic JavaScript language features directly contradict Ahead-Of-Time compilation and are classified as Tier 3 Unsupported:

- **Runtime Code Generation (`eval()` & `new Function()`):** Evaluating arbitrary code from strings at runtime requires shipping a complete TypeScript parser, symbol binder, type checker, SSA middle-end, and LLVM/interpreter runtime inside the native binary. This would inflate binary size by 40+ MB and introduce severe security attack vectors. _Status: Strictly Unsupported non-goal. Use build-time code generation or macros instead._
- **Runtime Prototype Mutation & Monkey-Patching:** ScriptGo compiles classes into contiguous C-like structs with devirtualized VTables. Method calls are lowered directly into native branch instructions (`call`) and inline expansions. Mutating prototypes at runtime (e.g. `Array.prototype.custom = ...` or modifying `__proto__`) destroys devirtualization, breaks struct offsets, and forces all calls into slow hash-table lookups. _Status: Monomorphic class inheritance (`extends`, `super`, getters/setters, class static blocks) is 100% supported; runtime monkey-patching is rejected._
- **Arbitrary `with` Statements:** The `with` statement injects dynamic scopes into the lexical scope chain, making it mathematically impossible to determine whether an identifier refers to an outer lexical variable or an object property at compile time. _Status: Rejected (strictly forbidden in TypeScript strict mode and native AOT)._
- **Dynamic Property Attachment on Sealed Records:** Static object literals compile to fixed-offset C structs. Dynamically adding new, undeclared fields to an existing object record at runtime is prohibited in Static mode.

## Deliberate semantic divergences

To maximize hardware efficiency and prevent subtle runtime bugs, ScriptGo adopts deliberate semantic divergences from the ECMAScript specification:

| Area                       | Standard JavaScript / V8                                                                      | ScriptGo Native Implementation                                                                              | Rationale & Safety Outcome                                                                                                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Array Layout & Bounds**  | Sparse hash maps; indexing `arr[100]` on length-3 array returns `undefined`; holes preserved. | Dense contiguous memory buffers (`T*` with `length` & `capacity`). Out-of-bounds indexing traps (`SG4001`). | Guarantees L1/L2 cache locality, constant-time indexing, and auto-vectorization (SIMD). Trapping prevents buffer over-reads and silent undefined propagation. Use `arr.at(i) ?? fallback` for safe nullish bounds. |
| **String Storage**         | UTF-16 code units stored in memory.                                                           | Compact UTF-8 byte buffers in memory; APIs transparently track UTF-16 code units.                           | Zero-copy I/O with system calls, filesystems, and network sockets without UTF-16 ↔ UTF-8 transcoding overhead. Standard indexing (`.length`, `.charCodeAt()`) remains 100% compliant with JS specifications.       |
| **Memory Management**      | Heavy tracing garbage collector with non-deterministic stop-the-world pauses.                 | Compile-time escape analysis, temporary object regions, and reference counting with cycle detection.        | Predictable sub-millisecond tail latency and zero GC pauses. Ideal for high-throughput microservices, CLI tools, and audio/video processing.                                                                       |
| **Numeric Representation** | Tagged pointers / NaN-boxed values on heap or stack.                                          | Unboxed 64-bit IEEE-754 floating-point hardware registers (`f64`).                                          | Direct hardware arithmetic. Missing optional fields in numeric contexts represent missing states as `NaN`; nullish coalescing (`??`) treats missing-state `NaN` as nullish.                                        |

## WASI sandbox fences

When compiling to WebAssembly (`--target wasm32-wasi`), applications execute inside the WASI Preview 1 capability sandbox. The compiler checks target capabilities at build time:

- **Raw Networking (`SG3001`):** Listening TCP servers (`net.createServer()`) and raw Berkeley sockets are physically unsupported in WASI preview1. Outgoing HTTP requests should use the standard WinterCG `fetch()` API provided by WASI host runtimes.
- **Process Spawning (`SG3002`):** `child_process.fork()` and process execution APIs are disallowed inside the WebAssembly sandbox.
- **Signal Handling (`SG3003`):** POSIX OS signals (`process.on('SIGINT')`) are unsupported by the WASI preview1 specification.

ScriptGo flags these capability constraints at compile time with actionable `SG3001`–`SG3003` diagnostics rather than compiling non-functional or silently failing native stubs.
