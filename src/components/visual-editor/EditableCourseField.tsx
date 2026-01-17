import { useState, useRef, useEffect } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { updateCourse } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import FormattingToolbar from './FormattingToolbar';

interface EditableCourseFieldProps {
  courseId: string;
  field: 'title' | 'short_description' | 'course_date' | 'duration' | 'location' | 'category' | 'modality' | 'instructor';
  currentValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  onEditingChange?: (isEditing: boolean) => void;
}

export default function EditableCourseField({
  courseId,
  field,
  currentValue,
  as: Component = 'span',
  className,
  onEditingChange
}: EditableCourseFieldProps) {
  const { isEditing } = useVisualEditor();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const originalValue = useRef(currentValue);

  const canEdit = isEditing && isAdmin;

  // Notify parent when editing state changes
  useEffect(() => {
    onEditingChange?.(isFocused);
  }, [isFocused, onEditingChange]);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleSave = async () => {
    if (!contentRef.current) return;
    
    const newValue = contentRef.current.innerHTML.trim();
    
    if (newValue === originalValue.current) {
      return;
    }

    setIsSaving(true);
    try {
      await updateCourse(courseId, { [field]: newValue });
      originalValue.current = newValue;
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['active-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      
      toast.success('Curso atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Erro ao atualizar curso');
      // Revert to original value
      if (contentRef.current) {
        contentRef.current.innerHTML = originalValue.current;
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (contentRef.current) {
      contentRef.current.innerHTML = originalValue.current;
    }
    contentRef.current?.blur();
  };

  const handleConfirm = () => {
    contentRef.current?.blur();
  };

  if (!canEdit) {
    return (
      <Component 
        className={className}
        dangerouslySetInnerHTML={{ __html: currentValue }}
      />
    );
  }

  return (
    <div 
      className="relative inline"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isFocused && setIsHovered(false)}
    >
      {/* Formatting toolbar when focused */}
      {isFocused && (
        <div className="absolute -top-14 left-0 z-50">
          <FormattingToolbar onFormat={handleFormat} />
        </div>
      )}

      <Component
        ref={contentRef as any}
        className={cn(
          className,
          "transition-all duration-200 outline-none",
          (isHovered || isFocused) && "ring-2 ring-primary ring-offset-2 cursor-text rounded",
          isSaving && "opacity-50"
        )}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => {
          setIsFocused(true);
          originalValue.current = contentRef.current?.innerHTML || currentValue;
        }}
        onBlur={() => {
          // Small delay to allow button clicks to register
          setTimeout(() => {
            setIsFocused(false);
            setIsHovered(false);
            handleSave();
          }, 200);
        }}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            (e.target as HTMLElement).blur();
          }
          if (e.key === 'Escape') {
            if (contentRef.current) {
              contentRef.current.innerHTML = originalValue.current;
            }
            (e.target as HTMLElement).blur();
          }
        }}
        dangerouslySetInnerHTML={{ __html: currentValue }}
      />

      {isHovered && !isFocused && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap z-50">
          Clique para editar
        </div>
      )}
      
      {isFocused && (
        <div className="absolute -top-14 right-0 flex items-center gap-1 z-50">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full transition-colors"
            title="Salvar"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
            title="Cancelar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
