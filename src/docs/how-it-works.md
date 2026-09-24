# How it works

ScriptGo combines the official **TypeScript-Go** frontend maintained by Microsoft with an independent, target-agnostic **Typed IR** middle-end and an **LLVM IR** native code generator.

## Compilation pipeline

Every TypeScript file passes through an explicit multi-stage lowering pipeline:

```text
TypeScript Source (.ts)
  │
  ▼ [Frontend: Microsoft TypeScript-Go]
AST Construction • Symbol Binding • Type Checking • Control-Flow Analysis
  │
  ▼ [Native Subset Gate]
Tier Classification: Tier 1 (Static) │ Tier 2 (Dynamic Island) │ Tier 3 (Unsupported)
  │
  ▼ [Lowering Boundary (internal/lowering)]
Typed IR Module (SSA values, explicit conversions, memory allocations, source spans)
  │
  ▼ [Middle-End SSA Optimizer (internal/opt) — Fixed-Point 5x Iterations]
Constant Folding • CSE • LICM • Temporary Object Regions • Dead Code Elimination
  │
  ▼ [LLVM Backend (internal/backend/llvm)]
LLVM IR (.ll) + Target Data Layouts + Runtime ABI Declarations
  │
  ▼ [Native Compiler Driver: Clang / Zig cc]
Linked with native runtime (internal/runtime/runtime.c)
  │
  ▼
Standalone Native Executable (Mach-O / ELF / PE) OR WebAssembly Module (.wasm)
```

## TypeScript-Go frontend

Rather than inventing an ad-hoc or incomplete TypeScript parser, ScriptGo embeds the official [TypeScript (Go implementation)](https://github.com/microsoft/TypeScript) compiler frontend developed by Microsoft.

This guarantees that parsing, lexical scope resolution, type inference, union narrowing, and diagnostic reporting strictly follow the official TypeScript language specification. ScriptGo adapts this checked AST into a normalized compilation input without duplicating language semantics.

## Middle-end SSA optimizer

Before emitting LLVM IR, ScriptGo's target-independent optimizer (`internal/opt`) executes a fixed-point iteration loop (up to 5 iterations) over the in-memory Typed IR. After every single pass, `m.Verify()` is asserted to enforce strict IR invariants:

- **Constant Folding & Algebraic Simplification:** Evaluates compile-time numeric, boolean, and string operations. Eliminates redundant algebraic operations such as `x + 0`, `x * 1`, `x - 0`, and `x * 0`.
- **Common Subexpression Elimination (CSE):** Scans basic blocks to identify equivalent pure SSA instructions and duplicate memory loads, reusing precomputed values.
- **Loop-Invariant Code Motion (LICM):** Detects natural loops via back-edges, identifies loop-invariant pure instructions, and hoists them into loop preheaders.
- **Temporary Object Regions:** Employs compiler escape analysis on builder/visitor patterns and loop-local class instances. Objects proven not to escape their lexical scope bypass heap allocations and are reclaimed in bulk without garbage collector overhead.
- **Dead Code Elimination (DCE):** Prunes unused SSA instructions and strips unreachable basic blocks.

## Memory & runtime model

ScriptGo achieves native C-like speed through a deterministic value and memory model:

- **Unboxed Numbers:** Standard `number` values map directly to 64-bit IEEE-754 hardware floating-point registers (`f64`). Primitive arithmetic executes directly on hardware without heap boxing or NaN-tagging overhead.
- **Zero-Copy String Slices:** String literals are emitted as immutable borrowed UTF-8 C string pointers. String allocations use owned heap buffers with length metadata, supporting embedded null bytes.
- **Static Object Layouts:** Object records and class instances with static shapes are compiled to contiguous C structs with fixed byte offsets, replacing runtime hash-map lookups with direct pointer offsets.
- **Microtask Event Loop:** The native runtime provides an ECMAScript-compliant microtask queue. Promises, `async`/`await`, and `queueMicrotask()` execute in conformant JavaScript event loop ordering without relying on an external VM.
- **Canonical 24-byte Boxed Value (ABI v1):** When dynamic types or exceptions cross boundaries, ScriptGo uses the canonical ABI v1 structure:

```c
typedef struct {
    uint32_t tag;       /* 0=undef, 1=null, 2=bool, 3=num, 4=str, 5=obj, 6=arr, etc. */
    uint32_t flags;     /* SCRIPTGO_VALUE_OWNED, SCRIPTGO_VALUE_ENGINE_REF */
    uint64_t payload;   /* direct scalar value or pointer */
    uint64_t aux;       /* string length or auxiliary metadata */
} scriptgo_value;
```
