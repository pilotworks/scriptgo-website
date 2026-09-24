export interface BenchmarkItem {
  name: string;
  description: string;
  metric: 'time' | 'memory' | 'size';
  unit: string;
  scriptgo: number;
  bun: number;
  node: number;
  speedupVsNode: number;
  speedupVsBun?: number;
  binarySizeFormatted?: string;
  binarySizeBytes?: number;
}

// Exactly copied from web/src/data/benchmark-results.json (output of benchmarks/harness.ts)
export const benchmarkData: BenchmarkItem[] = [
  {
    name: 'Cold Start Latency',
    description: 'Process spawn to Hello World execution completion',
    metric: 'time',
    unit: 'ms',
    scriptgo: 9.03,
    bun: 9.99,
    node: 53.18,
    speedupVsNode: 5.89,
    speedupVsBun: 1.11,
    binarySizeFormatted: '34 KB',
    binarySizeBytes: 34648,
  },
  {
    name: 'Base Memory (RSS)',
    description: 'Peak Resident Set Size on basic script invocation',
    metric: 'memory',
    unit: 'MB',
    scriptgo: 6.0,
    bun: 10.6,
    node: 68.3,
    speedupVsNode: 11.38,
    speedupVsBun: 1.77,
  },
  {
    name: 'Quicksort 100k',
    description: 'Sorting 100k random 64-bit numbers in place',
    metric: 'time',
    unit: 'ms',
    scriptgo: 20.63,
    bun: 20.91,
    node: 68.89,
    speedupVsNode: 3.34,
    speedupVsBun: 1.01,
    binarySizeFormatted: '67 KB',
    binarySizeBytes: 69096,
  },
  {
    name: 'Buffer Ops (10MB)',
    description: 'Bulk byte slicing, transforms and endian conversions',
    metric: 'time',
    unit: 'ms',
    scriptgo: 10.56,
    bun: 15.62,
    node: 63.12,
    speedupVsNode: 5.98,
    speedupVsBun: 1.48,
    binarySizeFormatted: '68 KB',
    binarySizeBytes: 69320,
  },
  {
    name: 'Matrix Mult 256x256',
    description: 'Double precision 2D matrix calculation',
    metric: 'time',
    unit: 'ms',
    scriptgo: 24.0,
    bun: 41.36,
    node: 85.89,
    speedupVsNode: 3.58,
    speedupVsBun: 1.72,
    binarySizeFormatted: '67 KB',
    binarySizeBytes: 68336,
  },
  {
    name: 'Mandelbrot 500x500',
    description: 'Complex plane arithmetic computation',
    metric: 'time',
    unit: 'ms',
    scriptgo: 32.57,
    bun: 43.3,
    node: 82.67,
    speedupVsNode: 2.54,
    speedupVsBun: 1.33,
    binarySizeFormatted: '34 KB',
    binarySizeBytes: 34936,
  },
];

// Exact binary sizes measured across suites by benchmarks/harness.ts
export const measuredBinarySizes = [
  {
    suite: 'Cold Start (cold_start.ts)',
    size: '34 KB',
    bytes: '34,648 bytes',
    type: 'Mach-O / ELF',
  },
  {
    suite: 'Mandelbrot (mandelbrot.ts)',
    size: '34 KB',
    bytes: '34,936 bytes',
    type: 'Mach-O / ELF',
  },
  {
    suite: 'ES2024 Set Ops (es2024_set.ts)',
    size: '35 KB',
    bytes: '35,432 bytes',
    type: 'Mach-O / ELF',
  },
  {
    suite: 'Quicksort (quicksort.ts)',
    size: '67 KB',
    bytes: '69,096 bytes',
    type: 'Mach-O / ELF',
  },
  {
    suite: 'Matrix Mult (matrix_mult.ts)',
    size: '67 KB',
    bytes: '68,336 bytes',
    type: 'Mach-O / ELF',
  },
  {
    suite: 'Buffer Ops (buffer_ops.ts)',
    size: '68 KB',
    bytes: '69,320 bytes',
    type: 'Mach-O / ELF',
  },
  {
    suite: 'Base64 Transcode (base64_transcode.ts)',
    size: '67 KB',
    bytes: '68,712 bytes',
    type: 'Mach-O / ELF',
  },
  {
    suite: 'JSON Ops (json_ops.ts)',
    size: '165 KB',
    bytes: '168,656 bytes',
    type: 'Mach-O / ELF',
  },
  {
    suite: 'Twitter JSON (twitter_json.ts)',
    size: '233 KB',
    bytes: '238,880 bytes',
    type: 'Mach-O / ELF',
  },
];
