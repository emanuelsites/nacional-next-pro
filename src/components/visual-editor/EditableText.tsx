import { useState, useRef, useEffect } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Palette } from 'lucide-react';

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  page?: string;
  allowFormatting?: boolean;
  children?: React.ReactNode;
}

const colors = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', 
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

export default function EditableText({
  contentKey,
  defaultValue,
  as: Component = 'p',
  className,
  page = 'global',
  allowFormatting = false,
  children
}: EditableTextProps) {
  const { isEditing, getContent, updateContent } = useVisualEditor();
  const [isHovered, setIsHovered] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const contentRef = useRef<HTMLElement>(null);

  const content = getContent(contentKey, defaultValue);
  const displayContent = children || content;

  useEffect(() => {
    // Parse existing styles when editing starts
    if (isEditing && contentRef.current) {
      const computedStyle = window.getComputedStyle(contentRef.current);
      setTextColor(computedStyle.color);
    }
  }, [isEditing]);

  const handleInput = () => {
    if (contentRef.current) {
      const html = allowFormatting ? contentRef.current.innerHTML : contentRef.current.textContent || '';
      updateContent(contentKey, html, allowFormatting ? 'html' : 'text', page);
    }
  };

  const applyStyle = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    applyStyle('foreColor', color);
  };

  if (!isEditing) {
    return (
      <Component 
        className={className}
        dangerouslySetInnerHTML={allowFormatting ? { __html: content } : undefined}
      >
        {!allowFormatting ? displayContent : undefined}
      </Component>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !showToolbar && setIsHovered(false)}
    >
      {allowFormatting && showToolbar && (
        <div className="absolute -top-12 left-0 z-50 bg-background border border-border rounded-lg shadow-lg p-1 flex items-center gap-1">
          <Button
            size="icon"
            variant={isBold ? 'default' : 'ghost'}
            className="h-8 w-8"
            onClick={() => { setIsBold(!isBold); applyStyle('bold'); }}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={isItalic ? 'default' : 'ghost'}
            className="h-8 w-8"
            onClick={() => { setIsItalic(!isItalic); applyStyle('italic'); }}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={isUnderline ? 'default' : 'ghost'}
            className="h-8 w-8"
            onClick={() => { setIsUnderline(!isUnderline); applyStyle('underline'); }}
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <Button
            size="icon"
            variant={textAlign === 'left' ? 'default' : 'ghost'}
            className="h-8 w-8"
            onClick={() => { setTextAlign('left'); applyStyle('justifyLeft'); }}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={textAlign === 'center' ? 'default' : 'ghost'}
            className="h-8 w-8"
            onClick={() => { setTextAlign('center'); applyStyle('justifyCenter'); }}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={textAlign === 'right' ? 'default' : 'ghost'}
            className="h-8 w-8"
            onClick={() => { setTextAlign('right'); applyStyle('justifyRight'); }}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Palette className="h-4 w-4" style={{ color: textColor }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-5 gap-1">
                {colors.map(color => (
                  <button
                    key={color}
                    className={cn(
                      "w-6 h-6 rounded border-2",
                      textColor === color ? "border-primary" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <Component
        ref={contentRef as any}
        className={cn(
          className,
          "transition-all duration-200",
          isHovered && "ring-2 ring-primary ring-offset-2 cursor-text"
        )}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setShowToolbar(true)}
        onBlur={() => { 
          setTimeout(() => setShowToolbar(false), 200);
          handleInput();
        }}
        onInput={handleInput}
        dangerouslySetInnerHTML={allowFormatting ? { __html: content } : undefined}
      >
        {!allowFormatting ? content : undefined}
      </Component>

      {isHovered && !showToolbar && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
          Clique para editar
        </div>
      )}
    </div>
  );
}
