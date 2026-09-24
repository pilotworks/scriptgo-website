export interface PresetExample {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
  expectedStdout: string;
  typedIr: string;
  llvmIrSnippet: string;
}

export const presetExamples: PresetExample[] = [
  {
    id: 'hello',
    name: 'Hello World & Greetings',
    category: 'Basics',
    description: 'Basic function definition, string concatenation, and standard console output.',
    code: `// Hello World in ScriptGo
function greet(name: string): string {
  return "Hello, " + name + "! Welcome to ScriptGo.";
}

const message = greet("World");
console.log(message);
`,
    expectedStdout: `Hello, World! Welcome to ScriptGo.`,
    typedIr: `module "examples/hello.ts"
function main() -> void
  %t0: string = const "World"
  %message: string = call greet [%t0]
  print console.log [%message]
  return
function greet(name: string) -> string
  %t0: string = const "Hello, "
  %t1: string = binary "+" [%t0, %name]
  %t2: string = const "! Welcome to ScriptGo."
  %t3: string = binary "+" [%t1, %t2]
  return [%t3]`,
    llvmIrSnippet: `define i32 @main(i32 %argc, ptr %argv) nounwind {
  call void @scriptgo_process_init(i32 %argc, ptr %argv)
  %t0 = getelementptr inbounds [6 x i8], ptr @.str.2, i64 0, i64 0
  %message = call ptr @greet(ptr %t0)
  %status = call i32 @scriptgo_console_log_string(ptr %message)
  call i32 @scriptgo_timers_drain()
  ret i32 0
}`,
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci (Iterative & Recursive)',
    category: 'Algorithms',
    description:
      'Demonstrating arithmetic loop lowering, recursive calls, and zero-overhead number registers.',
    code: `// Fibonacci calculation in ScriptGo
function fibIterative(n: number): number {
  if (n <= 1) return n;
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

function fibRecursive(n: number): number {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

console.log("=== Fibonacci Demo ===");
console.log("fibIterative(10): " + fibIterative(10));
console.log("fibIterative(30): " + fibIterative(30));
console.log("fibRecursive(15): " + fibRecursive(15));
`,
    expectedStdout: `=== Fibonacci Demo ===
fibIterative(10): 55
fibIterative(30): 832040
fibRecursive(15): 610`,
    typedIr: `function fibIterative(n: number) -> number
  %t1: bool = compare "<=" [%n, 1]
  if [%t1] then: return [%n]
  %prev: number = const 0
  %curr: number = const 1
  %i: number = const 2
  while [%t2] cond: %t2 = compare "<=" [%i, %n]
  body:
    %next: number = binary "+" [%prev, %curr]
    %prev = assign [%curr]
    %curr = assign [%next]
    %i = binary "+" [%i, 1]
  return [%curr]`,
    llvmIrSnippet: `define internal double @fibIterative(double %n) nounwind {
entry:
  %cmp = fcmp ole double %n, 1.000000e+00
  br i1 %cmp, label %ret_early, label %loop_init
loop:
  %next = fadd double %prev, %curr
  %i_next = fadd double %i, 1.000000e+00
  ...
}`,
  },
  {
    id: 'oop',
    name: 'OOP, Classes & Inheritance',
    category: 'Language',
    description:
      'Abstract classes, static blocks, getters/setters, polymorphic VTables, and instanceof.',
    code: `// OOP in ScriptGo: Classes, VTables & Polymorphism
abstract class Animal {
  public static registryCount: number = 0;
  static {
    Animal.registryCount = 100;
  }

  protected _name: string;
  constructor(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public abstract speak(): string;
  public describe(): string {
    return "[Fauna] " + this._name + ": " + this.speak();
  }
}

class Dog extends Animal {
  private readonly breed: string;
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }

  public override speak(): string {
    return this.name + " (" + this.breed + ") barks!";
  }
}

const dog = new Dog("Rex", "Shepherd");
console.log("Dog Name: " + dog.name);
console.log("Dog Speak: " + dog.speak());
console.log("Dog Describe: " + dog.describe());
console.log("Is Animal? " + (dog instanceof Animal));
console.log("Registry Count: " + Animal.registryCount);
`,
    expectedStdout: `Dog Name: Rex
Dog Speak: Rex (Shepherd) barks!
Dog Describe: [Fauna] Rex: Rex (Shepherd) barks!
Is Animal? true
Registry Count: 100`,
    typedIr: `class Animal {
  field _name: string
  static registryCount: number
  method name() -> string
  method speak() -> string
  method describe() -> string
}
class Dog extends Animal {
  field breed: string
  override method speak() -> string
}`,
    llvmIrSnippet: `@Animal_vtable = internal constant [2 x ptr] [ptr @Animal_describe, ptr null]
@Dog_vtable = internal constant [2 x ptr] [ptr @Animal_describe, ptr @Dog_speak]

define internal ptr @Dog_speak(ptr %this) nounwind {
  %name = call ptr @Animal_get_name(ptr %this)
  ...
}`,
  },
  {
    id: 'async',
    name: 'Async / Await & Microtasks',
    category: 'Async',
    description:
      'Promises, microtask queue execution order conforming to standard JS event loop ordering.',
    code: `// Async event loop microtasks ordering
async function computeAsync(val: number): Promise<number> {
  return val * 2;
}

async function main() {
  console.log("1. Sync start");

  queueMicrotask(() => {
    console.log("3. Microtask queue ran");
  });

  const res = await computeAsync(21);
  console.log("4. Await completed: " + res);

  console.log("5. Sync end");
}

console.log("0. Script loading");
main();
console.log("2. Sync after call");
`,
    expectedStdout: `0. Script loading
1. Sync start
2. Sync after call
3. Microtask queue ran
4. Await completed: 42
5. Sync end`,
    typedIr: `function main() -> Promise<void>
  print console.log ["1. Sync start"]
  call queueMicrotask [closure]
  %p: Promise<number> = call computeAsync [21]
  %res: number = await [%p]
  print console.log ["4. Await completed: ", %res]`,
    llvmIrSnippet: `define internal ptr @main() nounwind {
  call i32 @scriptgo_console_log_string(ptr @str_sync_start)
  call i32 @scriptgo_queue_microtask(ptr %closure_slot)
  %promise = call ptr @computeAsync(double 21.0)
  call void @scriptgo_promise_await(ptr %promise, ptr %resume_state)
  ...
}`,
  },
  {
    id: 'set_ops',
    name: 'ES2024 Set Methods',
    category: 'Modern JS',
    description: 'ECMAScript 2024 Set methods: union, intersection, difference, and subset checks.',
    code: `// ES2024 Set Methods in ScriptGo
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

const unionSet = setA.union(setB);
const intersectionSet = setA.intersection(setB);
const differenceSet = setA.difference(setB);

console.log("=== ES2024 Set Demo ===");
console.log("Union size: " + unionSet.size);
console.log("Intersection size: " + intersectionSet.size);
console.log("Difference size: " + differenceSet.size);
console.log("Is disjoint? " + setA.isDisjointFrom(new Set([7, 8])));
console.log("Is subset? " + new Set([1, 2]).isSubsetOf(setA));
`,
    expectedStdout: `=== ES2024 Set Demo ===
Union size: 6
Intersection size: 2
Difference size: 2
Is disjoint? true
Is subset? true`,
    typedIr: `call Set.union [%setA, %setB] -> Set<number>
call Set.intersection [%setA, %setB] -> Set<number>
call Set.difference [%setA, %setB] -> Set<number>
call Set.isDisjointFrom [%setA, %setC] -> bool`,
    llvmIrSnippet: `define i32 @main(...) {
  %union = call ptr @scriptgo_set_union(ptr %setA, ptr %setB)
  %intersect = call ptr @scriptgo_set_intersection(ptr %setA, ptr %setB)
  ...
}`,
  },
  {
    id: 'node_core',
    name: 'Node Core: Path & Crypto',
    category: 'Node.js',
    description: 'Native implementations of node:path and node:crypto with zero Node.js runtime.',
    code: `// Node.js Core Modules in ScriptGo
import * as path from "node:path";
import * as crypto from "node:crypto";

console.log("=== Node Core Demo ===");

// 1. Path operations
const appDir = path.join("/var", "app", "service");
console.log("Joined path: " + appDir);
console.log("Dirname: " + path.dirname(appDir));
console.log("Basename: " + path.basename(appDir));

// 2. Crypto operations
const uuid = crypto.randomUUID();
console.log("Generated UUID length: " + uuid.length);
console.log("UUID has hyphens: " + uuid.includes("-"));
`,
    expectedStdout: `=== Node Core Demo ===
Joined path: /var/app/service
Dirname: /var/app
Basename: service
Generated UUID length: 36
UUID has hyphens: true`,
    typedIr: `call node:path.join ["/var", "app", "service"] -> string
call node:path.dirname [%appDir] -> string
call node:path.basename [%appDir] -> string
call node:crypto.randomUUID [] -> string`,
    llvmIrSnippet: `define i32 @main(...) {
  %path = call ptr @scriptgo_path_join(ptr @str_var, ptr @str_app, ptr @str_svc)
  %uuid = call ptr @scriptgo_crypto_random_uuid()
  ...
}`,
  },
];
