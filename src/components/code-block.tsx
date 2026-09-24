import React, { useRef, useState } from 'react';

export const CodeBlock: React.FC<React.HTMLAttributes<HTMLPreElement>> = ({
  children,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (!preRef.current) return;
    const codeEl = preRef.current.querySelector('code') || preRef.current;
    const text = codeEl.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button
        type="button"
        className="copy-btn"
        onClick={handleCopy}
        aria-label="Copy code"
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '4px 8px',
          fontSize: '11px',
          fontWeight: 600,
          background: 'var(--bg-btn)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          color: copied ? 'var(--color-primary)' : 'var(--fg)',
          cursor: 'pointer',
          zIndex: 5,
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};
