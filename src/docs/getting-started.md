# Getting started

ScriptGo delivers a complete native toolchain for TypeScript in a single standalone binary. It requires no Node.js runtime, no npm, and no external JavaScript engine to compile or run code.

## Installation

Install ScriptGo using your preferred package manager or download pre-compiled releases:

### Homebrew (macOS & Linux)

```sh
brew install pilotworks/tap/scriptgo
```

### Pre-built binaries (GitHub Releases)

Download pre-compiled native binaries for your operating system and architecture:

```sh
# macOS Apple Silicon (arm64)
curl -fsSL https://github.com/pilotworks/scriptgo/releases/latest/download/scriptgo-darwin-arm64 -o /usr/local/bin/scriptgo
chmod +x /usr/local/bin/scriptgo

# Linux (x86_64)
curl -fsSL https://github.com/pilotworks/scriptgo/releases/latest/download/scriptgo-linux-amd64 -o /usr/local/bin/scriptgo
chmod +x /usr/local/bin/scriptgo
```

### Build from source (Go 1.24+)

```sh
git clone https://github.com/pilotworks/scriptgo.git
cd scriptgo
go build -o scriptgo ./cmd/scriptgo
sudo mv scriptgo /usr/local/bin/
```

### Toolchain prerequisites

ScriptGo generates LLVM IR and invokes a C compiler driver (Clang or Zig CC) to assemble and link native binaries:

- **macOS:** Installed automatically with Xcode Command Line Tools (`xcode-select --install`).
- **Linux:** Install standard Clang (`sudo apt install clang` or `sudo dnf install clang`).
- **Zero-dependency alternative:** Install [Zig](https://ziglang.org/) (`zig cc`). ScriptGo auto-detects Zig in your `$PATH` for out-of-the-box cross-compilation without needing system C headers.

## First native binary

Create a TypeScript source file, for example `server.ts`:

```ts
// server.ts
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.join(process.cwd(), 'config.json');
console.log(`Loading configuration from: ${configPath}`);
console.log(`ScriptGo Process ID: ${process.pid}`);
```

Compile it directly to an optimized native binary:

```sh
# 1. Compile to native machine code
scriptgo build server.ts -o server

# 2. Inspect the resulting binary (e.g. on macOS / Linux)
file ./server
# ./server: Mach-O 64-bit executable arm64 (or ELF 64-bit LSB executable, x86-64)

# 3. Execute the standalone binary (zero external runtime required)
./server
```

For rapid development, execute TypeScript files directly on the host or evaluate inline scripts:

```sh
# Compile and execute immediately in memory
scriptgo run server.ts

# Evaluate inline code
scriptgo run -e "console.log('Math.sqrt(144) =', Math.sqrt(144))"
```
