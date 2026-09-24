# Cross-compilation

ScriptGo uses Clang or Zig CC as its compiler driver. By leveraging [Zig CC](https://ziglang.org/), ScriptGo can cross-compile to any supported operating system and architecture without installing separate cross-compilation toolchains or headers.

## WebAssembly (WASI)

ScriptGo compiles TypeScript Ahead-Of-Time directly to standalone WebAssembly modules (WASI preview1):

```sh
# 1. Compile to standalone WebAssembly
scriptgo build app.ts --target wasm32-wasi -o app.wasm

# 2. Run with any conformant WASM runtime
wasmtime app.wasm

# Or run via Node.js WASI
node -e '
  const { WASI } = require("wasi");
  const fs = require("fs");
  const wasi = new WASI({ version: "preview1", args: ["app.wasm"] });
  const bytes = fs.readFileSync("app.wasm");
  WebAssembly.instantiate(bytes, wasi.getImportObject()).then(({ instance }) => wasi.start(instance));
'
```

## Zig CC multi-target

Specify `--cc "zig cc"` to cross-compile across platforms seamlessly:

```sh
# Cross-compile for Linux x86_64 (glibc)
scriptgo build app.ts --cc "zig cc" --target x86_64-linux-gnu -o app-linux-gnu

# Cross-compile for Linux x86_64 (musl - zero libc dependency)
scriptgo build app.ts --cc "zig cc" --target x86_64-linux-musl -o app-linux-musl

# Cross-compile for macOS Apple Silicon (ARM64)
scriptgo build app.ts --cc "zig cc" --target aarch64-macos -o app-macos-arm64

# Cross-compile for Windows x86_64
scriptgo build app.ts --cc "zig cc" --target x86_64-windows-gnu -o app-windows.exe
```
