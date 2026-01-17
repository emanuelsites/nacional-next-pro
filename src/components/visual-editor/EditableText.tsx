import { useState, useRef, useEffect } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { cn } from '@/lib/utils';
import FormattingToolbar from './FormattingToolbar';

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  page?: string;
  allowFormatting?: boolean;
  children?: React.ReactNode;
}

export default function EditableText({
  contentKey,
  defaultValue,
  as: Component = 'p',
  className,
  page = 'global',
  allowFormatting = true,
  children
}: EditableTextProps) {
  const { isEditing, getContent, updateContent } = useVisualEditor();
  const [isHovered, setIsHovered] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  const content = getContent(contentKey, defaultValue);

  const handleInput = () => {
    if (contentRef.current) {
      updateContent(contentKey, contentRef.current.innerHTML, 'html', page);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
    contentRef.current?.focus();
  };

  if (!isEditing) {
    return (
      <Component 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !showToolbar && setIsHovered(false)}
    >
      {showToolbar && allowFormatting && (
        <div className="absolute -top-14 left-0 z-50">
          <FormattingToolbar onFormat={handleFormat} />
        </div>
      )}

      <Component
        ref={contentRef as any}
        className={cn(
          className,
          "transition-all duration-200 outline-none",
          isHovered && "ring-2 ring-primary ring-offset-2 cursor-text rounded"
        )}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setShowToolbar(true)}
        onBlur={() => { 
          setTimeout(() => setShowToolbar(false), 200);
          handleInput();
        }}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {isHovered && !showToolbar && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
          Clique para editar
        </div>
      )}
    </div>
  );
}
