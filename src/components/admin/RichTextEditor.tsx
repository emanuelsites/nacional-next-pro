import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Font sizes in pixels
const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'];

// Register custom font sizes
const Size = ReactQuill.Quill.import('attributors/style/size');
Size.whitelist = fontSizes;
ReactQuill.Quill.register(Size, true);

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'color', 'background',
  'align',
  'link', 'image',
  'size'
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
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
        ['link', 'image'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-background rounded-lg"
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
      `}</style>
    </div>
  );
}