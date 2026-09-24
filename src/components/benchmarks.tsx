import React, { useState } from 'react';

import { benchmarkData, BenchmarkItem, measuredBinarySizes } from '../data/benchmarks';

export const Benchmarks: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<
    'latency' | 'memory' | 'quicksort' | 'buffer' | 'matrix' | 'packaging'
  >('latency');

  const getActiveItem = (): BenchmarkItem => {
    switch (activeMetric) {
      case 'memory':
        return benchmarkData[1];
      case 'quicksort':
        return benchmarkData[2];
      case 'buffer':
        return benchmarkData[3];
      case 'matrix':
        return benchmarkData[4];
      default:
        return benchmarkData[0];
    }
  };

  const item = getActiveItem();
  const maxVal = Math.max(item.scriptgo, item.bun, item.node);
  const sgWidth = Math.max(4, (item.scriptgo / maxVal) * 100);
  const bunWidth = Math.max(4, (item.bun / maxVal) * 100);
  const nodeWidth = Math.max(4, (item.node / maxVal) * 100);

  const compVerb = item.metric === 'memory' ? 'uses' : 'is';
  const compLabelNode = item.metric === 'memory' ? 'less RAM than node' : 'faster than node';
  const compLabelBun = item.metric === 'memory' ? 'less RAM than bun' : 'faster than bun';

  return (
    <figure id="benchmarks" style={{ margin: '24px 0' }}>
      <div className="bench-controls">
        <button
          className={`bench-btn ${activeMetric === 'latency' ? 'active' : ''}`}
          onClick={() => setActiveMetric('latency')}
        >
          Cold Start
        </button>
        <button
          className={`bench-btn ${activeMetric === 'memory' ? 'active' : ''}`}
          onClick={() => setActiveMetric('memory')}
        >
          Memory (RSS)
        </button>
        <button
          className={`bench-btn ${activeMetric === 'quicksort' ? 'active' : ''}`}
          onClick={() => setActiveMetric('quicksort')}
        >
          Quicksort
        </button>
        <button
          className={`bench-btn ${activeMetric === 'buffer' ? 'active' : ''}`}
          onClick={() => setActiveMetric('buffer')}
        >
          Buffer Ops
        </button>
        <button
          className={`bench-btn ${activeMetric === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveMetric('matrix')}
        >
          Matrix Mult
        </button>
        <button
          className={`bench-btn ${activeMetric === 'packaging' ? 'active' : ''}`}
          onClick={() => setActiveMetric('packaging')}
        >
          Binary Size
        </button>
      </div>

      <div className="bench-chart-container">
        {activeMetric === 'packaging' ? (
          <table style={{ margin: '0 auto', width: '100%' }}>
            <thead>
              <tr>
                <th>Benchmark Suite</th>
                <th>Compiled Binary Size</th>
                <th>Exact Byte Size</th>
                <th>Format</th>
              </tr>
            </thead>
            <tbody>
              {measuredBinarySizes.map((b) => (
                <tr key={b.suite}>
                  <td>
                    <code>{b.suite}</code>
                  </td>
                  <td>
                    <strong>{b.size}</strong>
                  </td>
                  <td>{b.bytes}</td>
                  <td>{b.type} (zero JS engine)</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>
            <div className="bench-chart">
              <div className="bench-row">
                <div className="bench-label">
                  <a
                    href="https://github.com/pilotworks/scriptgo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    scriptgo
                  </a>
                </div>
                <div className="bench-track">
                  <div className="bench-bar highlight" style={{ width: `${sgWidth}%` }}></div>
                </div>
                <div className="bench-value">
                  {item.scriptgo} {item.unit}
                </div>
              </div>

              <div className="bench-row">
                <div className="bench-label">bun</div>
                <div className="bench-track">
                  <div className="bench-bar" style={{ width: `${bunWidth}%` }}></div>
                </div>
                <div className="bench-value">
                  {item.bun} {item.unit}
                </div>
              </div>

              <div className="bench-row">
                <div className="bench-label">node</div>
                <div className="bench-track">
                  <div className="bench-bar" style={{ width: `${nodeWidth}%` }}></div>
                </div>
                <div className="bench-value">
                  {item.node} {item.unit}
                </div>
              </div>
            </div>

            <div className="bench-summary-row">
              <strong>Result:</strong> ScriptGo {compVerb}{' '}
              <strong>
                {item.speedupVsNode}x {compLabelNode}
              </strong>
              {item.speedupVsBun && item.speedupVsBun > 1.05 ? (
                <>
                  {' '}
                  (and{' '}
                  <strong>
                    {item.speedupVsBun}x {compLabelBun}
                  </strong>
                  )
                </>
              ) : null}
              .
            </div>
          </>
        )}
      </div>

      <figcaption>
        {activeMetric === 'packaging' ? (
          <>
            Above: Standalone binary sizes compiled with <code>scriptgo build -O 3 --release</code>{' '}
            as recorded by <code>benchmarks/harness.ts</code>. Output executables require zero
            external runtime or VM.
          </>
        ) : (
          <>
            Above: {item.name} ({item.description}). Measured via <code>benchmarks/harness.ts</code>{' '}
            (median of repeated runs, peak RSS via <code>/usr/bin/time</code>). Lower is better.
          </>
        )}
      </figcaption>
    </figure>
  );
};
