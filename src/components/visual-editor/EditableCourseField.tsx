import { useState, useRef } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { updateCourse } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface EditableCourseFieldProps {
  courseId: string;
  field: 'title' | 'short_description' | 'course_date' | 'duration' | 'location';
  currentValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
}

export default function EditableCourseField({
  courseId,
  field,
  currentValue,
  as: Component = 'span',
  className
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

  const handleSave = async () => {
    if (!contentRef.current) return;
    
    const newValue = contentRef.current.innerText.trim();
    
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
        contentRef.current.innerText = originalValue.current;
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!canEdit) {
    return (
      <Component className={className}>
        {currentValue}
      </Component>
    );
  }

  return (
    <div 
      className="relative inline"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isFocused && setIsHovered(false)}
    >
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
          originalValue.current = contentRef.current?.innerText || currentValue;
        }}
        onBlur={() => {
          setIsFocused(false);
          setIsHovered(false);
          handleSave();
        }}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            (e.target as HTMLElement).blur();
          }
          if (e.key === 'Escape') {
            if (contentRef.current) {
              contentRef.current.innerText = originalValue.current;
            }
            (e.target as HTMLElement).blur();
          }
        }}
      >
        {currentValue}
      </Component>

      {isHovered && !isFocused && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap z-50">
          Clique para editar
        </div>
      )}
      
      {isFocused && (
        <div className="absolute -top-6 left-0 bg-accent text-accent-foreground text-xs px-2 py-1 rounded whitespace-nowrap z-50">
          Enter para salvar, Esc para cancelar
        </div>
      )}
    </div>
  );
}
