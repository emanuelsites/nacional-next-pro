import { useMemo, useRef, useCallback, useEffect, useState } from 'react';
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
  const [editorReady, setEditorReady] = useState(false);

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
      container: [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'size': fontSizes }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'divider'],
        ['clean']
      ],
      handlers: {
        divider: function() {
          // Placeholder - will be replaced after mount
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  useEffect(() => {
    if (editorReady) {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const toolbar = quill.getModule('toolbar');
        if (toolbar) {
          toolbar.addHandler('divider', insertDivider);
        }
      }
    }
  }, [editorReady, insertDivider]);

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-background rounded-lg"
        onChangeSelection={() => {
          if (!editorReady) setEditorReady(true);
        }}
      />
      <style>{`
        .rich-text-editor .ql-toolbar {
          border-color: hsl(var(--border));
          border-radius: 0.5rem 0.5rem 0 0;
          background: hsl(var(--muted));
          flex-wrap: wrap;
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
        .rich-text-editor .ql-snow .ql-toolbar button.ql-divider,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-divider {
          width: 32px;
          padding: 3px 5px;
          position: relative;
          background: hsl(var(--primary) / 0.1);
          border-radius: 4px;
          margin: 0 2px;
        }
        .rich-text-editor .ql-snow .ql-toolbar button.ql-divider:hover,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-divider:hover {
          background: hsl(var(--primary) / 0.2);
        }
        .rich-text-editor .ql-snow .ql-toolbar button.ql-divider::after,
        .rich-text-editor .ql-snow.ql-toolbar button.ql-divider::after {
          content: '━━';
          font-weight: bold;
          font-size: 10px;
          color: hsl(var(--primary));
        }
        .rich-text-editor .ql-snow .ql-toolbar button.ql-divider[title]::before {
          content: 'Linha Separadora';
          position: absolute;
          bottom: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: hsl(var(--foreground));
          color: hsl(var(--background));
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
          z-index: 100;
        }
        .rich-text-editor .ql-snow .ql-toolbar button.ql-divider:hover::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
