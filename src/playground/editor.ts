import { javascript } from '@codemirror/lang-javascript';
import { Compartment, EditorState } from '@codemirror/state';
import { basicSetup, EditorView } from 'codemirror';

const themeCompartment = new Compartment();

const editorDarkTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--color-bg-code)',
      color: 'var(--color-text)',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)',
      height: '100%',
    },
    '.cm-content': {
      caretColor: 'var(--color-accent)',
      padding: '12px 0',
    },
    '.cm-line': {
      padding: '0 16px',
      lineHeight: '1.6',
    },
    '.cm-cursor': {
      borderLeftColor: 'var(--color-accent)',
      borderLeftWidth: '2px',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--color-bg-code)',
      color: 'var(--color-text-muted)',
      border: 'none',
      borderRight: '1px solid var(--color-border)',
      userSelect: 'none',
      paddingRight: '6px',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: 'var(--color-text)',
    },
    '&.cm-focused': {
      outline: 'none',
    },
  },
  { dark: true }
);

export interface CodeEditorOptions {
  container: HTMLElement;
  initialCode: string;
  onChange?: (code: string) => void;
}

export class CodeEditor {
  private view: EditorView;

  constructor(options: CodeEditorOptions) {
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && options.onChange) {
        options.onChange(this.getCode());
      }
    });

    const state = EditorState.create({
      doc: options.initialCode,
      extensions: [
        basicSetup,
        javascript({ typescript: true }),
        themeCompartment.of(editorDarkTheme),
        updateListener,
      ],
    });

    this.view = new EditorView({
      state,
      parent: options.container,
    });
  }

  public getCode(): string {
    return this.view.state.doc.toString();
  }

  public setCode(code: string): void {
    const transaction = this.view.state.update({
      changes: {
        from: 0,
        to: this.view.state.doc.length,
        insert: code,
      },
    });
    this.view.dispatch(transaction);
  }

  public focus(): void {
    this.view.focus();
  }

  public destroy(): void {
    this.view.destroy();
  }
}
