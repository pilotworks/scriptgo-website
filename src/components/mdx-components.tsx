import React from 'react';

import { Benchmarks } from './benchmarks';
import { CodeBlock } from './code-block';
import { ParityTable } from './parity-table';
import { Playground } from './playground';

const headingAliases: Record<string, string[]> = {
  scriptgo: ['overview'],
  installation: ['install'],
  'first-native-binary': ['quick-build'],
  'compilation-pipeline': ['pipeline'],
  'typescript-go-frontend': ['frontend'],
  'middle-end-ssa-optimizer': ['optimizer'],
  'memory--runtime-model': ['memory-model'],
  '394-corpus-tests': ['corpus-tests'],
  'diagnostic-codes-sgxxxx': ['diagnostics'],
  'whole-program-audit': ['overview'],
  'cli-commands--flags': ['cli'],
  'json-schema-format': ['json-schema'],
  'cicd-quality-gates': ['ci-cd'],
  'zero-copy-package-manager': ['pkg-pipeline'],
  'supply-chain-safety': ['pkg-security'],
  'the-4-tier-model': ['stdlib-tiers'],
  'nodejs-core-modules': ['node-apis'],
  'web-standards-wintercg': ['wintercg'],
  'direct-c-linkage': ['ffi-direct'],
  'version-locked-manifests': ['ffi-manifests'],
  'aot-design-rationale': ['design-rationale'],
  'type-system-fences': ['type-fences'],
  'restricted-dynamic-features': ['restricted-features'],
  'deliberate-semantic-divergences': ['divergences'],
  'wasi-sandbox-fences': ['wasi-fences'],
  'webassembly-wasi': ['wasi'],
  'zig-cc-multi-target': ['zig-cc'],
  'command-overview': ['overview'],
  'scriptgo-build': ['build'],
  'scriptgo-run': ['run'],
  'scriptgo-check': ['check'],
  'scriptgo-emit': ['emit'],
  'scriptgo-coverage': ['coverage'],
  'package-manager-commands': ['package-manager'],
  'global-flags--env': ['global-flags'],
};

const CustomH2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  id,
  children,
  ...props
}) => {
  const aliases = id ? headingAliases[id] : undefined;
  return (
    <h2 id={id} {...props}>
      {aliases?.map((alias) => (
        <span key={alias} id={alias} style={{ display: 'none' }} />
      ))}
      {children}
    </h2>
  );
};

export const mdxComponents = {
  pre: CodeBlock,
  h2: CustomH2,
  Benchmarks,
  ParityTable,
  Playground,
};
