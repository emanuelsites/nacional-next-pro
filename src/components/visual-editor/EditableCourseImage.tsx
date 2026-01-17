import { useState, useRef } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { useAuth } from '@/contexts/AuthContext';
import { updateCourse } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditableCourseImageProps {
  courseId: string;
  currentImageUrl: string;
  alt: string;
  className?: string;
}

export default function EditableCourseImage({
  courseId,
  currentImageUrl,
  alt,
  className = '',
}: EditableCourseImageProps) {
  const { isEditing: isEditorActive } = useVisualEditor();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canEdit = isEditorActive && isAdmin;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `course-${courseId}-${Date.now()}.${fileExt}`;
      const filePath = `course-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('courses')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('courses')
        .getPublicUrl(filePath);

      await updateCourse(courseId, { image_url: publicUrl });
      setImageUrl(publicUrl);

      queryClient.invalidateQueries({ queryKey: ['course'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['active-courses'] });

      toast.success('Imagem atualizada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-course-image', {
        body: { 
          courseTitle: alt,
          category: 'Curso'
        },
      });

      if (error) throw error;
      if (!data?.imageUrl) throw new Error('Nenhuma imagem foi gerada');

      await updateCourse(courseId, { image_url: data.imageUrl });
      setImageUrl(data.imageUrl);

      queryClient.invalidateQueries({ queryKey: ['course'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['active-courses'] });

      toast.success('Imagem gerada com sucesso!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Erro ao gerar imagem com IA');
    } finally {
      setIsGenerating(false);
    }
  };

  // Non-editable mode
  if (!canEdit) {
    return (
      <img 
        src={imageUrl} 
        alt={alt} 
        className={className}
      />
    );
  }

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <img 
        src={imageUrl} 
        alt={alt} 
        className={className}
      />

      {/* Overlay when hovering */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 z-40">
          <Button
            variant="default"
            size="lg"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isGenerating}
            className="bg-white text-black hover:bg-white/90"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </>
            )}
          </Button>
          
          <Button
            variant="default"
            size="lg"
            onClick={handleGenerateImage}
            disabled={isUploading || isGenerating}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Gerar com IA
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}