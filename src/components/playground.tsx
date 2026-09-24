import React, { useEffect, useRef } from 'react';

export const Playground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current || initializedRef.current) return;
    initializedRef.current = true;

    import('../playground/index').then(({ Playground: PlaygroundClass }) => {
      if (mountRef.current) {
        const id = 'pg-root-mount';
        mountRef.current.id = id;
        const pg = new PlaygroundClass(id);
        pg.init();
      }
    });
  }, []);

  return (
    <div id="try-it-out" style={{ margin: '32px 0' }}>
      <h2 id="try-it-out-heading">Try it out in your browser</h2>
      <p>
        Compile and execute TypeScript Ahead-Of-Time directly inside WebAssembly (WASI) in your
        browser with zero server round-trip:
      </p>
      <div className="playground-wrapper">
        <div ref={mountRef} id="pg-root-mount">
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--fg)' }}>
            <span className="status-pill status-idle">Loading Interactive Playground...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
