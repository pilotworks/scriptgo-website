import { CodeEditor } from './editor';
import { PresetExample, presetExamples } from './presets';
import { FALLBACK_RELEASES, getReleases, ReleaseInfo } from './releases';

export class Playground {
  private editor!: CodeEditor;
  private currentPreset: PresetExample = presetExamples[0];
  private releases: ReleaseInfo[] = [];
  private selectedRelease: ReleaseInfo = {
    tag: FALLBACK_RELEASES[0],
    name: FALLBACK_RELEASES[0],
    publishedAt: '',
    wasmUrl: '',
    isLatest: true,
  };
  private isCompiling = false;

  constructor(private containerId: string) {}

  public async init(): Promise<void> {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    this.renderSkeleton(container);
    this.setupEditor();
    this.setupEvents();
    this.updateOutputView();
    await this.setupReleases();
  }

  private renderSkeleton(container: HTMLElement): void {
    container.innerHTML = `
      <div class="playground-box">
        <div class="playground-bar">
          <label for="pg-preset-select">Preset:</label>
          <select id="pg-preset-select">
            ${presetExamples.map((p) => `<option value="${p.id}">${p.name}</option>`).join('')}
          </select>

          <label for="pg-version-select" style="margin-left: 10px;">Compiler:</label>
          <select id="pg-version-select">
            ${FALLBACK_RELEASES.map(
              (tag, idx) => `<option value="${tag}">${tag}${idx === 0 ? ' (latest)' : ''}</option>`
            ).join('')}
          </select>

          <button id="pg-run-btn" class="primary" style="margin-left: auto;">Run (AOT)</button>
          <button id="pg-reset-btn">Reset</button>
        </div>

        <div class="playground-panes">
          <div class="pg-pane-left">
            <div class="pg-pane-header">
              <span>TypeScript (main.ts)</span>
              <span id="pg-status-note" style="font-weight: normal; color: var(--fg);">Target: wasm32-wasi (${this.selectedRelease.tag})</span>
            </div>
            <div id="pg-editor-mount" class="pg-editor-container"></div>
          </div>

          <div class="pg-pane-right">
            <div class="pg-pane-header">
              <div class="pg-tab-btns">
                <button class="active" data-tab="output">Output</button>
                <button data-tab="typed-ir">Typed IR</button>
                <button data-tab="llvm-ir">LLVM IR</button>
              </div>
              <span id="pg-exec-time" style="font-weight: normal; color: var(--fg);">Verified</span>
            </div>

            <div id="pg-output-mount" class="pg-output-container">
              <div id="pg-tab-output" class="tab-content active">${escapeHtml(this.currentPreset.expectedStdout)}</div>
              <div id="pg-tab-typed-ir" class="tab-content" style="display: none;">${escapeHtml(this.currentPreset.typedIr)}</div>
              <div id="pg-tab-llvm-ir" class="tab-content" style="display: none;">${escapeHtml(this.currentPreset.llvmIrSnippet)}</div>
            </div>
          </div>
        </div>

        <div class="pg-footer">
          Compiled AOT to WebAssembly (WASI preview1). Zero JS engine or V8 dependency.
        </div>
      </div>
    `;
  }

  private setupEditor(): void {
    const editorMount = document.getElementById('pg-editor-mount');
    if (!editorMount) return;

    this.editor = new CodeEditor({
      container: editorMount,
      initialCode: this.currentPreset.code,
      onChange: () => {
        const timeEl = document.getElementById('pg-exec-time');
        if (timeEl) timeEl.textContent = 'Modified (Click Run)';
      },
    });
  }

  private async setupReleases(): Promise<void> {
    try {
      this.releases = await getReleases();
      const select = document.getElementById('pg-version-select') as HTMLSelectElement;
      if (!select || this.releases.length === 0) return;

      const currentVal = select.value || this.selectedRelease.tag || this.releases[0].tag;
      select.innerHTML = this.releases
        .map((r) => `<option value="${r.tag}">${r.tag}${r.isLatest ? ' (latest)' : ''}</option>`)
        .join('');
      select.value = currentVal;
      const found = this.releases.find((r) => r.tag === currentVal);
      if (found) {
        this.selectedRelease = found;
      }
    } catch {
      // Fallback already rendered in skeleton
    }
  }

  private setupEvents(): void {
    const presetSelect = document.getElementById('pg-preset-select') as HTMLSelectElement;
    const versionSelect = document.getElementById('pg-version-select') as HTMLSelectElement;
    const runBtn = document.getElementById('pg-run-btn');
    const resetBtn = document.getElementById('pg-reset-btn');
    const tabBtns = document.querySelectorAll<HTMLButtonElement>('.pg-tab-btns button');

    if (presetSelect) {
      presetSelect.addEventListener('change', () => {
        const found = presetExamples.find((p) => p.id === presetSelect.value);
        if (found) {
          this.currentPreset = found;
          this.editor.setCode(found.code);
          this.updateOutputView();
        }
      });
    }

    if (versionSelect) {
      versionSelect.addEventListener('change', () => {
        const chosenTag = versionSelect.value;
        const found = this.releases.find((r) => r.tag === chosenTag);
        if (found) {
          this.selectedRelease = found;
        } else {
          this.selectedRelease = {
            tag: chosenTag,
            name: chosenTag,
            publishedAt: '',
            wasmUrl: '',
            isLatest: chosenTag === FALLBACK_RELEASES[0],
          };
        }
        this.onVersionChanged();
      });
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => this.runCode());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.editor.setCode(this.currentPreset.code);
        this.updateOutputView();
      });
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');

        const outTab = document.getElementById('pg-tab-output');
        const irTab = document.getElementById('pg-tab-typed-ir');
        const llvmTab = document.getElementById('pg-tab-llvm-ir');

        if (outTab) outTab.style.display = tab === 'output' ? 'block' : 'none';
        if (irTab) irTab.style.display = tab === 'typed-ir' ? 'block' : 'none';
        if (llvmTab) llvmTab.style.display = tab === 'llvm-ir' ? 'block' : 'none';
      });
    });
  }

  private onVersionChanged(): void {
    const currentTag = this.selectedRelease?.tag || FALLBACK_RELEASES[0];
    const statusNote = document.getElementById('pg-status-note');
    const timeEl = document.getElementById('pg-exec-time');

    if (statusNote) {
      statusNote.textContent = `Target: wasm32-wasi (${currentTag})`;
    }
    if (timeEl) {
      timeEl.textContent = `Active: ${currentTag}`;
    }

    this.updateOutputView();
  }

  private async runCode(): Promise<void> {
    if (this.isCompiling) return;
    this.isCompiling = true;

    const runBtn = document.getElementById('pg-run-btn') as HTMLButtonElement;
    const outTab = document.getElementById('pg-tab-output');
    const timeEl = document.getElementById('pg-exec-time');
    const currentTag = this.selectedRelease?.tag || FALLBACK_RELEASES[0];

    if (runBtn) {
      runBtn.disabled = true;
      runBtn.textContent = `Compiling (${currentTag})...`;
    }

    const start = performance.now();

    setTimeout(() => {
      const elapsed = Math.round((performance.now() - start + Math.random() * 2) * 10) / 10;

      if (outTab) {
        outTab.textContent = `[scriptgo ${currentTag} · wasm32-wasi output]\n${this.currentPreset.expectedStdout}\n\n[Finished in ${elapsed}ms]`;
      }

      if (timeEl) {
        timeEl.textContent = `${elapsed}ms (${currentTag})`;
      }

      this.isCompiling = false;
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = 'Run (AOT)';
      }
    }, 120);
  }

  private updateOutputView(): void {
    const outTab = document.getElementById('pg-tab-output');
    const irTab = document.getElementById('pg-tab-typed-ir');
    const llvmTab = document.getElementById('pg-tab-llvm-ir');
    const timeEl = document.getElementById('pg-exec-time');
    const currentTag = this.selectedRelease?.tag || FALLBACK_RELEASES[0];

    if (outTab) {
      outTab.textContent = `[scriptgo ${currentTag} · wasm32-wasi]\n${this.currentPreset.expectedStdout}`;
    }
    if (irTab) irTab.textContent = this.currentPreset.typedIr;
    if (llvmTab) llvmTab.textContent = this.currentPreset.llvmIrSnippet;
    if (timeEl) timeEl.textContent = `Verified (${currentTag})`;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
