import { ParityTable } from '../components/parity-table';

# Compatibility Matrix

ScriptGo tests against the Node.js core subset using a 394-case regression suite (379 native PASS + 15 diagnostic PASS). Compatibility is explicitly tracked across three strict compilation tiers to avoid silent semantic shifts.

## 394 Corpus tests

<ParityTable />

## Compilation tiers

Every reachable source site is evaluated into one of three compilation tiers after the TypeScript-Go frontend parses, resolves, and type-checks the program graph:

| Tier                       | Selection              | Execution Model                                                                                         | Result When Unavailable                                                                           |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Tier 1: Static Native**  | Default                | Compiles directly to Typed IR, LLVM IR, and native machine code. No JS engine is linked.                | Try Dynamic if `--dynamic` is enabled; otherwise report actionable `SGxxxx` error.                |
| **Tier 2: Dynamic Island** | Opt-in via `--dynamic` | Executes supported local JavaScript island through embedded QuickJS-ng via canonical 24-byte boxed ABI. | Reports dynamic boundary diagnostic when outside the supported island.                            |
| **Tier 3: Unsupported**    | Rejected               | No code emitted for non-goals (e.g. `eval()`, runtime prototype mutation, dynamic scope).               | Compile error with stable code, source span, code frame, and rewrite hint. Never silent fallback. |

## Diagnostic codes (SGxxxx)

When a construct cannot be lowered statically, ScriptGo reports a stable four-digit `SGxxxx` diagnostic code anchored with source spans, an ASCII code frame, and an actionable rewrite hint. Unlike runtimes that silently fall back or produce undefined behavior, ScriptGo guarantees semantic safety at compile time.

The diagnostic namespace is divided into six architectural categories:

| Range    | Category                          | Description & Scope                                                                                                                  |
| -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `SG1xxx` | Static Semantics & Type Boundary  | Unresolved `any`, unproven union narrowing, generic specialization, function values, structural flow, or unchecked `unknown`.        |
| `SG2xxx` | Static Lowering & Coverage Fences | Standard library members without static lowering, unsupported tuple/Date/Map/Set operations, or unlowered AST constructs.            |
| `SG3xxx` | Target Capabilities               | Hardware or OS platform constraints (WASI raw networking, child process spawning, POSIX signals, native FFI ABI mismatches).         |
| `SG4xxx` | Semantic Divergence & Safety      | Dense-array out-of-bounds safety traps, checked-cast assertions, width-conversion copy aliasing, or unrecoverable hard traps.        |
| `SG5xxx` | Dynamic Compatibility Boundaries  | Dynamic island engine unavailable, ABI signature arity/type mismatch, dynamic return value mismatch, or missing host event loop job. |
| `SG9xxx` | Internal Compiler & Fallback      | Compiler invariant violations, unreachable lowering states, or unclassified compiler aborts.                                         |

### Individual diagnostic error codes

The table below details every stable diagnostic code emitted by ScriptGo's static and dynamic lowering boundaries:

| Code     | Name                                   | Trigger Scenario                                                                                              | Resolution / Rewrite Hint                                                                                                    |
| -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `SG1001` | **`any` Boundary**                     | Value of dynamic type `any` used in Static mode without `--dynamic`.                                          | Provide concrete type annotation, narrow with `typeof`/`instanceof`, or compile with `--dynamic`.                            |
| `SG1002` | **Union Narrowing Unsupported**        | Property access or operation on union type (`A \| B`) without a static narrowing proof.                       | Narrow using discriminant property check (`obj.kind === 'foo'`) or `typeof` guard before accessing members.                  |
| `SG1003` | **Generic Specialization Unsupported** | Generic type arguments or memory layout cannot be monomorphized statically at compile time.                   | Supply explicit type arguments or constrain generic parameters to concrete types (`<T extends Record<string, string>>`).     |
| `SG1004` | **Unresolved Function Value**          | Unpinned generic function, dynamically reassigned callable binding, or untyped call target.                   | Pin the function signature explicitly with typed signature (`(a: number) => number`) or avoid dynamic callable reassignment. |
| `SG1005` | **Structural Flow Unsupported**        | Dynamic property access, prototype chain traversal, or incompatible structural record shape.                  | Use typed object indexing (`Record<string, T>`), sealed interface properties, or explicit key enums.                         |
| `SG1006` | **`unknown` Boundary**                 | Value typed as `unknown` used in operations without static narrowing proof or checked cast.                   | Narrow `val` using `typeof`, `instanceof`, or an explicit runtime type assertion before use.                                 |
| `SG2001` | **Stdlib Member Not Lowered**          | Declared API exists in standard library TypeScript definitions but lacks native Static IR lowering.           | Use supported core APIs, implement via ambient FFI (`declare function`), or execute with `--dynamic`.                        |
| `SG2002` | **Tuple Operation Not Lowered**        | Unsupported tuple method, non-constant tuple index, or dynamic tuple slice.                                   | Access tuple members using compile-time constant indices (e.g. `tuple[0]`) or convert to a typed dense array (`T[]`).        |
| `SG2003` | **Date Operation Not Lowered**         | Unsupported Date constructor variant, getter, parser, or formatter in native runtime.                         | Use standard ISO-8601 timestamps (`toISOString()`, `getTime()`, `Date.now()`).                                               |
| `SG2004` | **Map/Set Representation Limitation**  | Unsupported key or element type in collection (e.g. structural deep-equality object keys).                    | Use scalar keys (`string`, `number`, `bigint`, `symbol`) or reference-identity objects.                                      |
| `SG2005` | **Language Lowering Unsupported**      | Valid TypeScript/ECMAScript construct currently lacking Static IR lowering (e.g. empty object literal fence). | Provide explicit typed interface or initialize fields directly (`const x: Record<string, unknown> = { k: v };`).             |
| `SG3001` | **WASI / Network Unavailable**         | Raw TCP listening or socket operations attempted on target lacking socket support (e.g. `wasm32-wasi`).       | Target native OS (`x86_64-linux-gnu`, `aarch64-macos`), or use WinterCG `fetch()` in WASI environments with HTTP support.    |
| `SG3002` | **Process Capability Unavailable**     | Process spawning (`child_process.fork`/`spawn`) requested on sandboxed target.                                | Compile as native host binary or eliminate child process invocations in WebAssembly builds.                                  |
| `SG3003` | **Signal Capability Unavailable**      | POSIX OS signal registration (`process.on('SIGINT')`) on targets lacking signal semantics.                    | Guard signal handlers with platform capability checks (`if (process.platform !== 'wasi')`).                                  |
| `SG3004` | **Native FFI Capability Unavailable**  | Unsupported FFI argument/return signature or target platform lacks dynamic library loader.                    | Restrict FFI signatures to C-compatible primitive scalars (`number`, `cstring`, `ptr`, `i32`, `f64`).                        |
| `SG3005` | **Platform API Unavailable**           | Target-specific operating system API invoked without a corresponding platform adapter.                        | Use cross-platform `node:os` / `node:fs` abstractions or target-specific conditional compilation.                            |
| `SG3006` | **Unsafe Double Cast**                 | Pointer cast or double-width type punning rejected by target verification invariants.                         | Use `DataView` or `Buffer` for explicit, safe binary memory reinterpretation.                                                |
| `SG4001` | **Dense-Array Safety Divergence**      | Out-of-bounds indexing or hole-dependent operation on packed contiguous arrays.                               | Check bounds (`i < arr.length`) before indexing, or use safe nullish indexing (`arr.at(index) ?? fallback`).                 |
| `SG4002` | **Checked-Cast Failure**               | Runtime value does not satisfy a requested narrowing or cast assertion at runtime.                            | Verify upstream data satisfies the expected type contract before performing narrowing assertions.                            |
| `SG4003` | **Copy-on-Width Divergence**           | Structural width subtyping conversion changes memory aliasing from shared reference to cloned buffer.         | Avoid mutating shared references after structural layout conversion.                                                         |
| `SG4004` | **Runtime Hard Trap**                  | Non-catchable native process abort/panic triggered by an unrecoverable runtime invariant failure.             | Guard arithmetic and memory operations to prevent hardware traps (e.g. division by zero, stack overflow).                    |
| `SG4005` | **Warning Checked Cast**               | Compiler warning emitted when a checked cast insertion incurs runtime verification overhead.                  | Provide static type proofs or narrow via primitive type guards to eliminate runtime tag checks.                              |
| `SG5001` | **Dynamic Runtime Unavailable**        | Source site requires dynamic execution (`--dynamic`), but no dynamic engine is linked.                        | Pass `--dynamic` on CLI or rewrite the dynamic construct to a static TypeScript equivalent.                                  |
| `SG5002` | **Dynamic Input Mismatch**             | Dynamic island call received arguments with wrong arity or values outside declared ABI signature.             | Align parameter counts and ensure argument types match the ABI declaration.                                                  |
| `SG5003` | **Dynamic Result Mismatch**            | Dynamic island returned a boxed value outside its declared return constraint.                                 | Validate or coerce the return value inside the dynamic JavaScript module before returning to native code.                    |
| `SG5004` | **Dynamic Host Job Required**          | Dynamic Promise or async task requires an unavailable host event loop job to settle.                          | Await the Promise inside an async context or use native synchronous equivalents.                                             |
| `SG9001` | **Internal Compiler Fallback**         | Compiler invariant violation, unreachable lowering state, or unclassified compiler abort.                     | Report an issue on GitHub with reproduction source code.                                                                     |

### Compiler diagnostic output examples

ScriptGo formats diagnostic errors with high-visibility ASCII code frames, exact line and column coordinates, and actionable refactoring suggestions:

```text
error: SG1001: static mode cannot compile value of type `any`
  --> src/server.ts:18:7
   |
18 | const payload: any = JSON.parse(raw);
   |       ^^^^^^^ value has dynamic type `any`
   = note: the `any` type is not supported in native subset
   = hint: specify a concrete interface, narrow with `typeof`/`instanceof`, or pass `--dynamic`
```

```text
error: SG1002: union narrowing unsupported
  --> src/format.ts:32:14
   |
32 |   return val.length;
   |              ^^^^^^ property `length` does not exist on type `number`
   = note: union type `string | number` must be narrowed before accessing member
   = hint: narrow with `if (typeof val === 'string')` before accessing `.length`
```

```text
error: SG3001: WASI capability unavailable
  --> src/net.ts:5:21
   |
 5 | const server = net.createServer();
   |                     ^^^^^^^^^^^^ listening TCP sockets are unavailable under wasm32-wasi
   = note: the wasm32-wasi preview1 target does not support listening Berkeley sockets
   = hint: target a native OS (`x86_64-linux-gnu`, `aarch64-macos`) or use WinterCG `fetch()`
```
