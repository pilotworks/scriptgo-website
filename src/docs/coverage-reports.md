# Coverage reports

Before compiling an existing codebase or adding an npm library, run `scriptgo coverage`. It performs whole-program static and dynamic compatibility analysis without requiring Clang or LLVM, reporting the exact site-by-site compatibility distribution across all reachable files.

## Whole-program audit

The coverage command audits every AST node, statement, function call, and type site across your entire dependency graph. Because it operates at the frontend-to-lowering boundary, it executes in under **~200ms** even for large multi-file projects:

- **Frontend Verification:** Uses the Microsoft TypeScript-Go frontend to build the complete symbol table, module graph, and type relationships.
- **Zero Toolchain Overhead:** Evaluates native subset eligibility without invoking LLVM IR emission, Clang compilation, or machine code linking.
- **Site Classification:** Every reachable construct is categorized into one of three compilation tiers:
  - **Tier 1 (Static):** 100% compiled to native machine instructions. Direct scalar registers (`f64`/`i64`), fixed struct offsets, and devirtualized function calls with zero runtime overhead.
  - **Tier 2 (Dynamic):** Dispatched to the embedded QuickJS-ng dynamic island when `--dynamic` is enabled, marshalled through the canonical 24-byte boxed ABI.
  - **Tier 3 (Unsupported):** Non-goals or unlowered APIs that will halt compilation with an actionable `SGxxxx` error.

## CLI commands & flags

Inspect compatibility distributions, test dynamic island eligibility, or emit machine-readable JSON artifacts:

```sh
# 1. Human-readable summary of reachable source sites (Static default)
scriptgo coverage src/index.ts

# 2. Inspect compatibility with Dynamic island eligibility enabled
scriptgo coverage src/index.ts --dynamic

# 3. Emit deterministic machine-readable JSON artifact for CI/CD analysis
scriptgo coverage src/index.ts --dynamic --format json -o coverage.json
```

| Flag                    | Type    | Description                                                                                                                           |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `--dynamic`             | Boolean | Enables Dynamic island analysis. Eligible sites that require dynamic evaluation are classified as `Dynamic` instead of `Unsupported`. |
| `--format <text\|json>` | String  | Output format. Defaults to `text` (human-readable summary). Set to `json` for full machine-readable schema.                           |
| `-o, --output <file>`   | Path    | Write the coverage report to a specific file path instead of standard output.                                                         |
| `--tsconfig <path>`     | Path    | Path to custom `tsconfig.json` for compiler options and module resolution paths.                                                      |

Sample human-readable terminal output:

```text
$ scriptgo coverage src/server.ts --dynamic
ScriptGo coverage summary
Mode: dynamic-enabled
Result: dynamic-runtime-required
Sites: 156 total
  Static:      148 (94.9%)
  Dynamic:     6 (3.8%)
  Unsupported: 2 (1.3%)
Findings:
  SG1001: 6 site(s)
  SG2005: 2 site(s)
Details: rerun with --format json
```

## JSON schema format

When passed `--format json`, ScriptGo outputs a deterministic JSON artifact following schema `format: 1`. File paths are emitted as deterministic relative paths from the project root, guaranteeing identical hashes across different developer machines and CI runners:

```json
{
  "format": 1,
  "mode": "dynamic-enabled",
  "summary": {
    "static": 148,
    "dynamic": 6,
    "unsupported": 2
  },
  "sites": [
    {
      "tier": "dynamic",
      "path": "src/server.ts",
      "start": 412,
      "length": 28,
      "kind": "variable",
      "code": "SG1001",
      "message": "The any type is not supported in native subset.",
      "hint": "specify a concrete type or narrow before use"
    },
    {
      "tier": "unsupported",
      "path": "src/utils/legacy.ts",
      "start": 1054,
      "length": 18,
      "kind": "object_literal",
      "code": "SG2005",
      "message": "Empty object literal fence in native subset.",
      "hint": "provide explicit interface fields or initialize properties directly"
    }
  ]
}
```

| Field             | Type    | Description                                                                   |
| ----------------- | ------- | ----------------------------------------------------------------------------- |
| `format`          | Integer | Schema version (currently `1`).                                               |
| `mode`            | String  | Active compatibility mode: `"static"` or `"dynamic-enabled"`.                 |
| `summary`         | Object  | Total count of evaluated sites across `static`, `dynamic`, and `unsupported`. |
| `sites[].tier`    | String  | Selected tier: `"static"`, `"dynamic"`, or `"unsupported"`.                   |
| `sites[].path`    | String  | Normalized, deterministic relative path to the source file.                   |
| `sites[].start`   | Integer | Zero-indexed byte offset of the construct in the source file.                 |
| `sites[].length`  | Integer | Span length in bytes.                                                         |
| `sites[].kind`    | String  | TypeScript AST syntax node kind (e.g. `variable`, `call`, `type_assertion`).  |
| `sites[].code`    | String  | Stable diagnostic code (e.g. `"SG1001"`). Omitted for pure static sites.      |
| `sites[].message` | String  | Human-readable explanation of why the construct is gated or dynamic.          |
| `sites[].hint`    | String  | Actionable guidance for refactoring the code into the static tier.            |

## CI/CD quality gates

Coverage reports prevent silent dynamic bails from degrading the performance of latency-critical native binaries. Use coverage in continuous integration to enforce architectural policies:

- **Enforcing 100% Static Native Code:** Ensure mission-critical microservices never link the dynamic JavaScript engine or execute interpreter hops.
- **Auditing npm Dependencies:** Run coverage during package installation to verify whether a third-party dependency can compile to native code before committing.
- **Automated Pull Request Blocking:** Block PRs that introduce unsupported language constructs or unnarrowed `any` types.

Example GitHub Actions workflow step:

```yaml
# .github/workflows/ci.yml
- name: Audit ScriptGo Native Coverage
  run: |
    # Generate machine-readable coverage report
    scriptgo coverage src/main.ts --format json -o coverage.json

    # Assert zero unsupported sites and zero dynamic bailouts
    jq -e '.summary.unsupported == 0' coverage.json > /dev/null || {
      echo "::error::Build contains unsupported constructs rejected by native subset!"
      exit 1
    }

    jq -e '.summary.dynamic == 0' coverage.json > /dev/null || {
      echo "::warning::Build contains dynamic sites requiring QuickJS-ng interpreter island."
    }
```
