import { useMemo, useRef, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Font sizes in pixels
const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'];

// Register custom font sizes as inline styles
const Size = ReactQuill.Quill.import('attributors/style/size');
Size.whitelist = fontSizes;
ReactQuill.Quill.register(Size, true);

// Register color as inline style
const ColorStyle = ReactQuill.Quill.import('attributors/style/color');
ReactQuill.Quill.register(ColorStyle, true);

// Register background color as inline style
const BackgroundStyle = ReactQuill.Quill.import('attributors/style/background');
ReactQuill.Quill.register(BackgroundStyle, true);

// Register alignment as inline style
const AlignStyle = ReactQuill.Quill.import('attributors/style/align');
ReactQuill.Quill.register(AlignStyle, true);

// Custom divider blot for horizontal line
const BlockEmbed = ReactQuill.Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed {
  static blotName = 'divider';
  static tagName = 'hr';
}

ReactQuill.Quill.register(DividerBlot, true);

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'color', 'background',
  'align',
  'link', 'image',
  'size',
  'divider'
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const insertDivider = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      quill.insertText(range.index, '\n', 'user');
      quill.insertEmbed(range.index + 1, 'divider', true, 'user');
      quill.insertText(range.index + 2, '\n', 'user');
      quill.setSelection(range.index + 3, 0, 'user');
    }
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: '#toolbar',
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('divider', insertDivider);
    }
  }, [insertDivider]);

  return (
    <div className="rich-text-editor">
      <div id="toolbar">
        <select className="ql-header" defaultValue="">
          <option value="1">Título 1</option>
          <option value="2">Título 2</option>
          <option value="3">Título 3</option>
          <option value="">Normal</option>
        </select>
        <select className="ql-size" defaultValue="">
          {fontSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
        <select className="ql-color" />
        <select className="ql-background" />
        <select className="ql-align" />
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-divider" title="Inserir linha divisória">
          <svg viewBox="0 0 18 18" style={{ width: '18px', height: '18px' }}>
            <line x1="0" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <button className="ql-clean" />
      </div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-background rounded-lg"
      />
      <style>{`
        .rich-text-editor .ql-toolbar,
        .rich-text-editor #toolbar {
          border-color: hsl(var(--border));
          border-radius: 0.5rem 0.5rem 0 0;
          background: hsl(var(--muted));
          flex-wrap: wrap;
          border: 1px solid hsl(var(--border));
          padding: 8px;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .rich-text-editor .ql-container {
          border-color: hsl(var(--border));
          border-radius: 0 0 0.5rem 0.5rem;
          min-height: 200px;
          font-family: inherit;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
          color: hsl(var(--foreground));
        }
        .rich-text-editor .ql-editor hr {
          border: none;
          border-top: 2px solid hsl(var(--border));
          margin: 1rem 0;
          display: block;
          height: 0;
        }
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
        }
        .rich-text-editor .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        .rich-text-editor .ql-fill {
          fill: hsl(var(--foreground));
        }
        .rich-text-editor .ql-picker {
          color: hsl(var(--foreground));
        }
        .rich-text-editor .ql-picker-options {
          background: hsl(var(--background));
          border-color: hsl(var(--border));
        }
        .rich-text-editor .ql-picker.ql-size .ql-picker-label::before,
        .rich-text-editor .ql-picker.ql-size .ql-picker-item::before {
          content: attr(data-value);
        }
        .rich-text-editor .ql-picker.ql-size .ql-picker-label[data-value]::before {
          content: attr(data-value);
        }
        .rich-text-editor .ql-picker.ql-size .ql-picker-item[data-value]::before {
          content: attr(data-value);
        }
        .rich-text-editor .ql-snow .ql-picker.ql-size {
          width: 80px;
        }
        .rich-text-editor .ql-divider {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rich-text-editor .ql-divider svg {
          stroke: hsl(var(--foreground));
        }
      `}</style>
    </div>
  );
}
