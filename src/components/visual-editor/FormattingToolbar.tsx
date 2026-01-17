import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Palette,
  Type,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormattingToolbarProps {
  onFormat: (command: string, value?: string) => void;
  className?: string;
}

const colors = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', 
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#0f172a', '#dc2626', '#ea580c', '#ca8a04',
  '#16a34a', '#0891b2', '#2563eb', '#7c3aed', '#db2777'
];

const fontSizes = [
  { label: 'Pequeno', value: '1' },
  { label: 'Normal', value: '3' },
  { label: 'Médio', value: '4' },
  { label: 'Grande', value: '5' },
  { label: 'Maior', value: '6' },
  { label: 'Enorme', value: '7' },
];

export default function FormattingToolbar({ onFormat, className }: FormattingToolbarProps) {
  const handleFormat = (command: string, value?: string) => {
    onFormat(command, value);
  };

  return (
    <div className={cn(
      "bg-background border border-border rounded-lg shadow-lg p-1.5 flex items-center gap-0.5 flex-wrap",
      className
    )}>
      {/* Bold */}
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-foreground hover:text-foreground"
        onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }}
        title="Negrito"
      >
        <Bold className="h-4 w-4" />
      </Button>

      {/* Italic */}
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-foreground hover:text-foreground"
        onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }}
        title="Itálico"
      >
        <Italic className="h-4 w-4" />
      </Button>

      {/* Underline */}
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-foreground hover:text-foreground"
        onMouseDown={(e) => { e.preventDefault(); handleFormat('underline'); }}
        title="Sublinhado"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Font Size */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 px-2 gap-1 text-foreground hover:text-foreground"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Type className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32 p-1" align="start">
          <div className="flex flex-col">
            {fontSizes.map((size) => (
              <button
                key={size.value}
                className="text-left px-3 py-1.5 hover:bg-muted rounded text-sm transition-colors text-foreground"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleFormat('fontSize', size.value);
                }}
              >
                {size.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Alignment */}
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-foreground hover:text-foreground"
        onMouseDown={(e) => { e.preventDefault(); handleFormat('justifyLeft'); }}
        title="Alinhar à esquerda"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-foreground hover:text-foreground"
        onMouseDown={(e) => { e.preventDefault(); handleFormat('justifyCenter'); }}
        title="Centralizar"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-foreground hover:text-foreground"
        onMouseDown={(e) => { e.preventDefault(); handleFormat('justifyRight'); }}
        title="Alinhar à direita"
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-foreground hover:text-foreground"
            onMouseDown={(e) => e.preventDefault()}
            title="Cor do texto"
          >
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-5 gap-1">
            {colors.map(color => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleFormat('foreColor', color);
                }}
                title={color}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
