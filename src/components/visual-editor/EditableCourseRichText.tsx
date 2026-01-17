import { useState, useRef, useEffect } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { useAuth } from '@/contexts/AuthContext';
import { updateCourse } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormattingToolbar from './FormattingToolbar';

interface EditableCourseRichTextProps {
  courseId: string;
  field: 'full_description' | 'content' | 'prerequisites';
  currentValue: string;
  className?: string;
}

export default function EditableCourseRichText({
  courseId,
  field,
  currentValue,
  className = '',
}: EditableCourseRichTextProps) {
  const { isEditing: isEditorActive } = useVisualEditor();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const originalValue = useRef(currentValue);

  const canEdit = isEditorActive && isAdmin;

  useEffect(() => {
    originalValue.current = currentValue;
  }, [currentValue]);

  const handleStartEdit = () => {
    if (!canEdit) return;
    setIsLocalEditing(true);
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
      }
    }, 0);
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleSave = async () => {
    if (!contentRef.current) return;
    
    const newValue = contentRef.current.innerHTML.trim();
    
    if (newValue === originalValue.current) {
      setIsLocalEditing(false);
      return;
    }
    
    setIsSaving(true);
    try {
      await updateCourse(courseId, { [field]: newValue });
      originalValue.current = newValue;
      
      queryClient.invalidateQueries({ queryKey: ['course'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['active-courses'] });
      
      toast.success('Conteúdo atualizado com sucesso!');
      setIsLocalEditing(false);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Erro ao atualizar conteúdo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (contentRef.current) {
      contentRef.current.innerHTML = originalValue.current;
    }
    setIsLocalEditing(false);
  };

  // Non-editable mode
  if (!canEdit) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: currentValue }}
      />
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Formatting toolbar when editing */}
      {isLocalEditing && (
        <div className="sticky top-0 z-20 mb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <FormattingToolbar onFormat={handleFormat} />
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="default"
                className="h-8 px-3 bg-green-600 hover:bg-green-700"
                onMouseDown={(e) => { e.preventDefault(); handleSave(); }}
                disabled={isSaving}
              >
                <Check className="w-4 h-4 mr-1" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3"
                onMouseDown={(e) => { e.preventDefault(); handleCancel(); }}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit button overlay */}
      {!isLocalEditing && isHovered && (
        <div className="absolute -top-2 -right-2 z-10">
          <Button
            size="sm"
            variant="default"
            className="h-8 w-8 p-0 rounded-full shadow-lg"
            onClick={handleStartEdit}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Editable content */}
      <div
        ref={contentRef}
        contentEditable={isLocalEditing}
        suppressContentEditableWarning
        className={`${className} ${
          isLocalEditing 
            ? 'ring-2 ring-primary ring-offset-2 rounded-lg p-4 bg-background outline-none min-h-[100px]' 
            : isHovered 
              ? 'ring-2 ring-primary/30 ring-offset-2 rounded-lg cursor-pointer'
              : ''
        }`}
        dangerouslySetInnerHTML={{ __html: currentValue }}
        onClick={() => !isLocalEditing && handleStartEdit()}
      />
    </div>
  );
}