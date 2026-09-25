import React, { useMemo, useState } from 'react';

import { parityCategories, parityFeatures } from '../data/parity-data';

export const ParityTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFeatures = useMemo(() => {
    return parityFeatures.filter((f) => {
      const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.notes.toLowerCase().includes(q) ||
        f.tier.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div style={{ margin: '24px 0' }}>
      <p>
        All <strong>433 corpus regression test cases</strong> (416 native execution tests + 17
        static diagnostic tests) pass at <strong>100% parity</strong> against the Node.js v22 core
        subset on macOS and Linux.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {parityCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`bench-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            style={{ fontSize: '13px', padding: '6px 12px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="search-filter" style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter features (e.g. node:fs, async, array, class, crypto)..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--fg-on)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>

      <table id="parity-table">
        <thead>
          <tr>
            <th>Feature / API</th>
            <th>Compilation Tier</th>
            <th>Status</th>
            <th>Technical Behavior</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeatures.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: 'var(--fg)', padding: '24px' }}>
                No matching features found for "{searchTerm}".
              </td>
            </tr>
          ) : (
            filteredFeatures.map((item) => (
              <tr key={item.name}>
                <td>
                  <code>{item.name}</code>
                </td>
                <td>
                  <strong>{item.tier}</strong>
                </td>
                <td>
                  {item.status === 'Full' ? (
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                      ✓ Supported
                    </span>
                  ) : item.status === 'Partial' ? (
                    <span style={{ color: '#d97706', fontWeight: 600 }}>⚠️ Bounded</span>
                  ) : (
                    <span style={{ color: '#dc2626', fontWeight: 600 }}>✗ Non-goal</span>
                  )}
                </td>
                <td style={{ whiteSpace: 'normal', minWidth: '300px' }}>{item.notes}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
