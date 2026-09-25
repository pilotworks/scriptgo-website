# CLI reference

The `scriptgo` CLI provides a unified toolchain for compiling, running, type-checking, auditing, and packaging TypeScript applications as native binaries with zero external runtime dependencies.

## Command overview

```sh
# Direct file execution (run without typing 'run')
scriptgo <entry.ts> [-- <args...>]
scriptgo -e "<code string>" [-- <args...>]

# Subcommands
scriptgo <command> [flags] <arguments>

# Binary alias 'scg' (supported interchangeably across all commands)
scg <entry.ts> [-- <args...>]
scg <command> [flags] <arguments>
```

| Command                          | Syntax                                                                              | Description                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`build`](#scriptgo-build)       | `scriptgo build [flags] <entry.ts>`                                                 | Compile TypeScript into a standalone, optimized native executable.           |
| [`run`](#scriptgo-run)           | `scriptgo run [flags] <entry.ts> [-- <args>]`<br/>`scriptgo <entry.ts> [-- <args>]` | Compile and execute TypeScript immediately in memory or on the host.         |
| [`add`](#scriptgo-add)           | `scriptgo add [flags] <package...>`                                                 | Resolve, record, and install dependencies into `package.json` & lockfile.    |
| [`check`](#scriptgo-check)       | `scriptgo check [flags] [<entry.ts> \| <dir>]`                                      | Verify syntax, types, and native static subset rules without compiling.      |
| [`emit`](#scriptgo-emit)         | `scriptgo emit [flags] <entry.ts>`                                                  | Emit raw LLVM IR (`.ll`) or middle-end Typed IR text.                        |
| [`coverage`](#scriptgo-coverage) | `scriptgo coverage [flags] <entry.ts>`                                              | Analyze Static, Dynamic, and Unsupported site compatibility distribution.    |
| [`init`](#scriptgo-init)         | `scriptgo init [flags] [<dir>]`                                                     | Initialize a new TypeScript project with `tsconfig.json` and `package.json`. |
| [`install`](#scriptgo-install)   | `scriptgo install [flags]`                                                          | Resolve, verify (SRI), cache, and link `package.json` dependencies.          |
| [`task`](#scriptgo-task)         | `scriptgo task [flags] [<script>]`                                                  | Run a `package.json` script with `node_modules/.bin` in `$PATH`.             |
| `version`                        | `scriptgo version`                                                                  | Print compiler and runtime ABI version information.                          |
| `help`                           | `scriptgo help [<command>]`                                                         | Show usage help for ScriptGo or a specific sub-command.                      |

---

## Direct execution & scg alias

### Direct file execution

You can execute TypeScript files directly on the host without typing `run`, exactly like `node file.js` or `bun file.ts`:

```sh
# Run a TypeScript file directly
scriptgo main.ts
scg main.ts

# Pass command line arguments
scriptgo main.ts -- --port 8080 --verbose
scg main.ts -- --port 8080 --verbose

# Evaluate inline code directly
scriptgo -e "console.log('1 + 2 =', 1 + 2)"
scg -e "console.log('1 + 2 =', 1 + 2)"
```

When a command name matches an existing file, ScriptGo executes that file directly. Running `scriptgo run <script>` prioritizes scripts defined in `package.json` before falling back to local source file execution.

### Binary alias: `scg`

ScriptGo provides `scg` as an official, first-class short alias for `scriptgo`. It works interchangeably across all subcommands, direct executions, and flags:

```sh
# Direct execution
scg server.ts

# Compile and build
scg build server.ts --release -o server

# Add dependencies
scg add lodash-es
scg add -D typescript @types/node

# Type-check
scg check src/index.ts

# Run scripts or tasks
scg task build
scg run start
```

---

## scriptgo build

Compiles a TypeScript program into an optimized, standalone native executable linked with the host C runtime.

```sh
scriptgo build [flags] <entry.ts> [sources.c...] [-o <output>]
scriptgo build [flags] -e "<code string>" [-o <output>]
```

### Flags

| Flag                        | Type    | Description                                                                                                                          |
| --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `-o <path>`                 | Path    | Output executable path (default: `./<entry_basename>`).                                                                              |
| `-e, --eval <str>`          | String  | Compile an inline TypeScript code string directly.                                                                                   |
| `-m, --ffi-manifest <path>` | Path    | Path to FFI JSON metadata manifest (`*.ffi.json`).                                                                                   |
| `-O <level>`                | String  | Optimization level: `0`, `1`, `2`, `3`, `s`, `z`, `fast` (default: `2`).                                                             |
| `--release`                 | Boolean | Build with maximum production optimizations (`-O3`, `--lto=thin`, `--strip`).                                                        |
| `-s, --strip`               | Boolean | Strip symbols and debug tables from the generated binary.                                                                            |
| `--debug`                   | Boolean | Include native DWARF debug symbols (`-O0` with full debug metadata).                                                                 |
| `--lto <mode>`              | String  | Enable Link-Time Optimization: `thin`, `full`, or `none`.                                                                            |
| `--target <triple>`         | String  | Target architecture triple (e.g. `x86_64-linux-gnu`, `aarch64-macos`, `wasm32-wasi`). Defaults to `$SCRIPTGO_TARGET` or native host. |
| `--target-cpu <cpu>`        | String  | Target CPU architecture (e.g. `native`, `apple-m1`, `x86-64-v3`).                                                                    |
| `--cc <driver>`             | String  | C compiler / toolchain driver (e.g. `clang`, `zig cc`). Defaults to `$SCRIPTGO_CC` or `clang`.                                       |
| `--sanitize <list>`         | String  | Enable Clang sanitizers: comma-separated list of `address`, `undefined`, `leak`.                                                     |
| `--warn-runtime-casts`      | Boolean | Emit warnings when checked casts are inserted (`SG4005`).                                                                            |
| `--strict-casts`            | Boolean | Treat runtime checked cast warnings as compilation errors.                                                                           |
| `--dynamic`                 | Boolean | Enable Dynamic island execution for eligible sites via embedded QuickJS-ng.                                                          |
| `--install`                 | Boolean | Install `package.json` dependencies before compiling.                                                                                |
| `--offline`                 | Boolean | Use cached packages only with `--install`.                                                                                           |
| `--frozen`                  | Boolean | Enforce exact lockfile metadata with `--install`.                                                                                    |
| `--registry <url>`          | URL     | npm-compatible registry URL (default: `https://registry.npmjs.org`).                                                                 |
| `--store <path>`            | Path    | Content store cache directory (default: `~/.scriptgo/store`).                                                                        |
| `-v`                        | Boolean | Verbose output: prints compilation pipeline stages and intermediate timings.                                                         |

### Examples

```sh
# 1. Compile basic entrypoint to standalone binary
scriptgo build server.ts

# 2. Compile with custom output path
scriptgo build server.ts -o /usr/local/bin/my-server

# 3. Production release build (thin LTO, -O3, stripped symbols)
scriptgo build main.ts --release -o myapp

# 4. Cross-compile for Linux x86_64 using Zig CC
scriptgo build app.ts --cc "zig cc" --target x86_64-linux-gnu -o app_linux

# 5. Link native C source files directly
scriptgo build app.ts helper.c sqlite3.c -o full_app

# 6. Debugging with AddressSanitizer and DWARF symbols
scriptgo build app.ts --debug --sanitize address,undefined -o app_debug
```

---

## scriptgo run

Compiles and executes a TypeScript file or inline code string immediately in memory on the host, or runs a `package.json` script with ancestor `node_modules/.bin` in `$PATH`.

```sh
scriptgo run [flags] <entry.ts> [-- <args...>]
scriptgo run [flags] -e "<code string>" [-- <args...>]
scriptgo run [<script>] [-- <args...>]
```

### Flags

Supports all compilation flags from `scriptgo build` (`-O`, `--debug`, `--cc`, `--target`, `--dynamic`, `--ffi-manifest`), plus:

| Flag           | Type      | Description                                                                |
| -------------- | --------- | -------------------------------------------------------------------------- |
| `-e <string>`  | String    | Evaluate inline TypeScript script string directly.                         |
| `-- <args...>` | Arguments | Pass remaining arguments directly to the running program (`process.argv`). |

### Examples

```sh
# 1. Compile and execute immediately
scriptgo run server.ts

# 2. Pass command line arguments to the script
scriptgo run cli.ts -- --port 8080 --verbose

# 3. Evaluate inline TypeScript expression
scriptgo run -e "console.log('2^32 =', Math.pow(2, 32))"

# 4. Run package.json script
scriptgo run build
```

---

## scriptgo add

Resolves package versions from an npm-compatible registry or local workspace, records them into `package.json` (`dependencies`, `devDependencies`, `optionalDependencies`, `peerDependencies`), and installs them into `node_modules/` and `scriptgo-lock.json` with transactional rollback on failure.

```sh
scriptgo add [flags] <package...>
scg add [flags] <package...>
```

### Flags

| Flag                       | Type    | Description                                                              |
| -------------------------- | ------- | ------------------------------------------------------------------------ |
| `-D, --dev`                | Boolean | Save package to `devDependencies`.                                       |
| `-O, --optional`           | Boolean | Save package to `optionalDependencies`.                                  |
| `--peer`                   | Boolean | Save package to `peerDependencies`.                                      |
| `-E, --exact`              | Boolean | Save exact pinned version instead of `^x.y.z` SemVer range.              |
| `--offline`                | Boolean | Use only cached tarballs and existing lockfile without network requests. |
| `--project <dir>`          | Path    | Project directory containing `package.json` (default: `.`).              |
| `--manifest <path>`        | Path    | `package.json` path (default: `<project>/package.json`).                 |
| `--lockfile <path>`        | Path    | `scriptgo-lock.json` path (default: `<project>/scriptgo-lock.json`).     |
| `--store <path>`           | Path    | Content store cache directory (default: `~/.scriptgo/store`).            |
| `--registry <url>`         | URL     | npm-compatible registry URL (default: `https://registry.npmjs.org`).     |
| `--registry-token <token>` | String  | Registry bearer token (or `$SCRIPTGO_NPM_TOKEN` / `$NPM_TOKEN`).         |

### Examples

```sh
# 1. Add latest stable dependencies
scriptgo add lodash
scg add express

# 2. Add specific version or tag
scriptgo add chalk@4.1.2

# 3. Add development dependencies
scriptgo add -D typescript @types/node
scg add --dev vitest

# 4. Save exact pinned version (no ^ prefix)
scriptgo add -E redis
scg add --exact pg

# 5. Add optional or peer dependencies
scriptgo add -O sharp
scg add --peer react
```

---

## scriptgo check

Type-checks and validates the reachable source graph, `tsconfig.json` project, and native static subset rules without invoking LLVM IR code generation or Clang.

```sh
scriptgo check [flags] [<entry.ts> | <tsconfig.json> | <dir>]
scriptgo check [flags] -p, --project <path>
scriptgo check [flags] -e "<code string>"
```

### Flags

| Flag                   | Type    | Description                                            |
| ---------------------- | ------- | ------------------------------------------------------ |
| `-p, --project <path>` | Path    | Path to `tsconfig.json` or project directory.          |
| `-e <string>`          | String  | Type-check an inline TypeScript code string.           |
| `--warn-runtime-casts` | Boolean | Warn on runtime checked casts (`SG4005`).              |
| `--strict-casts`       | Boolean | Treat runtime cast warnings as hard errors.            |
| `--dynamic`            | Boolean | Enable Dynamic island eligibility during verification. |
| `-v`                   | Boolean | Verbose output: print check stages and confirmation.   |

### Examples

```sh
# 1. Type-check single entry point
scriptgo check src/server.ts

# 2. Validate entire tsconfig.json project
scriptgo check -p ./tsconfig.json

# 3. Enforce strict static cast safety
scriptgo check --strict-casts src/main.ts
```

---

## scriptgo emit

Emits intermediate representations (Typed IR or LLVM IR) for compiler inspection, debugging, or custom toolchain pipelines.

```sh
scriptgo emit [flags] <entry.ts> [--mode llvm-ir|typed-ir] [-o <output>]
scriptgo emit [flags] -e "<code string>" [--mode llvm-ir|typed-ir] [-o <output>]
```

### Flags

| Flag                | Type    | Description                                                    |
| ------------------- | ------- | -------------------------------------------------------------- |
| `--mode <mode>`     | String  | Output representation: `llvm-ir` (default) or `typed-ir`.      |
| `-o <path>`         | Path    | Write emitted IR to file instead of standard output.           |
| `--debug`           | Boolean | Include DWARF debug metadata in emitted LLVM IR.               |
| `--target <triple>` | String  | Target architecture triple for data layout and ABI generation. |

### Examples

```sh
# 1. Emit LLVM IR to stdout
scriptgo emit src/app.ts

# 2. Emit SSA Typed IR to inspect middle-end optimizer passes
scriptgo emit src/app.ts --mode typed-ir

# 3. Save optimized LLVM IR assembly to file
scriptgo emit src/app.ts --mode llvm-ir -o app.ll
```

---

## scriptgo coverage

Audits every reachable AST node, function call, and type site, reporting the compatibility distribution across Static, Dynamic, and Unsupported tiers.

```sh
scriptgo coverage [flags] <entry.ts> [-o <output>]
scriptgo coverage [flags] -e "<code string>" [-o <output>]
```

### Flags

| Flag                | Type    | Description                                                  |
| ------------------- | ------- | ------------------------------------------------------------ |
| `--format <format>` | String  | Output format: `summary` (default human-readable) or `json`. |
| `--dynamic`         | Boolean | Evaluate Dynamic island eligibility for non-static sites.    |
| `-o <path>`         | Path    | Write coverage report artifact to file.                      |

### Examples

```sh
# 1. Human-readable coverage summary
scriptgo coverage src/main.ts

# 2. Evaluate with dynamic island support
scriptgo coverage src/main.ts --dynamic

# 3. Export deterministic JSON report for CI/CD gates
scriptgo coverage src/main.ts --dynamic --format json -o coverage.json
```

---

## Package manager commands

ScriptGo includes a built-in, zero-copy package manager compatible with the npm registry:

### scriptgo init

Initializes a new ScriptGo TypeScript project with `package.json`, `tsconfig.json`, `src/index.ts`, and `.gitignore`.

```sh
scriptgo init [flags] [<directory>]

# Flags:
#   -y, --yes      Initialize with default settings without prompting
#   -f, --force    Overwrite existing files
#   --name <name>  Package name (defaults to directory name)
```

### scriptgo add

Resolves package versions from the npm registry or workspace, records them into `package.json`, and installs them into `node_modules/` and `scriptgo-lock.json`.

```sh
scriptgo add [flags] <package...>
scg add [flags] <package...>

# Flags:
#   -D, --dev             Add to devDependencies
#   -O, --optional        Add to optionalDependencies
#   --peer                Add to peerDependencies
#   -E, --exact           Save exact version instead of ^x.y.z
#   --offline             Use cached tarballs without network requests
#   --project <dir>       Project directory (default: .)
#   --manifest <path>     package.json path
#   --lockfile <path>     Lockfile path
#   --store <path>        Content store path (default: ~/.scriptgo/store)
#   --registry <url>      npm registry URL
#   --registry-token <t>  Registry bearer token
```

### scriptgo install

Resolves dependencies from an npm-compatible registry, verifies tarballs via streaming SHA-512 SRI hashes, stores immutable package content in content-addressable storage, writes `scriptgo-lock.json`, and links `node_modules/` via CoW/hardlinks.

```sh
scriptgo install [flags]

# Flags:
#   --project <dir>       Project directory (default: .)
#   --manifest <path>     package.json path
#   --lockfile <path>     Lockfile path
#   --store <path>        Content store path (default: ~/.scriptgo/store)
#   --registry <url>      npm registry URL (default: https://registry.npmjs.org)
#   --registry-token <t>  Registry bearer token (or $SCRIPTGO_NPM_TOKEN / $NPM_TOKEN)
#   --offline             Use only the lockfile and cached tarballs
#   --frozen              Assert exact versions from existing lockfile
```

### scriptgo task

Runs a specified script from `package.json` with ancestor `node_modules/.bin` prepended to `$PATH`. If no script is provided, lists available scripts.

```sh
scriptgo task [flags] [<script>] [-- <args...>]

# Examples:
scriptgo task build
scriptgo task test -- --verbose
```

---

## Global flags & env

### Environment variables

| Variable                           | Description                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `SCRIPTGO_TARGET`                  | Default target architecture triple (e.g. `x86_64-linux-gnu`, `aarch64-macos`).         |
| `SCRIPTGO_CC`                      | Default C compiler driver (e.g. `clang`, `zig cc`).                                    |
| `SCRIPTGO_NPM_TOKEN` / `NPM_TOKEN` | Bearer token for authenticated npm registry requests.                                  |
| `SCRIPTGO_REGISTRY`                | Default npm registry endpoint (default: `https://registry.npmjs.org`).                 |
| `SCRIPTGO_STORE`                   | Root directory for content-addressable package storage (default: `~/.scriptgo/store`). |

### Exit codes

| Exit Code | Meaning                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------- |
| `0`       | Success. Compilation, execution, or check succeeded without errors.                                     |
| `1`       | Semantic failure. TypeScript type error, native subset violation (`SGxxxx`), or runtime exception.      |
| `2`       | Command-line failure. Invalid CLI flags, missing required positional arguments, or unknown sub-command. |
