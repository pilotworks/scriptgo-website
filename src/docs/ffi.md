# Foreign Function Interface (FFI)

Because ScriptGo compiles TypeScript directly to LLVM IR and machine code, calling external C and system libraries incurs **zero wrapper overhead** and zero JIT marshalling penalty. External functions use the target platform's native C calling convention.

## Direct C linkage

Call any C standard library function or exported system symbol directly using standard TypeScript ambient `declare function` syntax:

```ts
// Direct C symbol declarations (ambient TypeScript)
declare function getpid(): number;
declare function sqrt(x: number): number;
declare function cos(x: number): number;
declare function puts(str: string): number;

console.log('Current Process ID:', getpid());
console.log('sqrt(144):', sqrt(144));
console.log('cos(0):', cos(0));
puts('Invoked directly through native libc puts() with zero overhead!');
```

## Version-locked manifests

To link external dynamic or static libraries (`-l`), search paths (`-L`, `-I`), macOS frameworks, or compile custom C files into your binary, ScriptGo uses declarative JSON manifests with `"ffi_format": 1`:

```json
{
  "ffi_format": 1,
  "name": "sqlite3",
  "link": {
    "libraries": ["sqlite3", "m"],
    "libDirs": ["/usr/local/lib", "/opt/homebrew/lib"],
    "includeDirs": ["/usr/local/include", "/opt/homebrew/include"],
    "sources": ["./native/sqlite_helper.c"],
    "cflags": ["-DSQLITE_ENABLE_JSON1=1"]
  },
  "symbols": {
    "sqlite3_libversion": { "symbol": "sqlite3_libversion", "args": [], "returns": "cstring" },
    "sqlite3_open": { "symbol": "sqlite3_open", "args": ["cstring", "ptr"], "returns": "i32" }
  }
}
```

Build with the manifest attached via the `--ffi-manifest` flag:

```sh
scriptgo build main.ts --ffi-manifest sqlite3.ffi.json -o main
```
