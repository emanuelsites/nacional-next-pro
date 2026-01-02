import { useState, useRef } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImageIcon, Upload, Loader2 } from 'lucide-react';

interface EditableImageProps {
  contentKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  page?: string;
}

export default function EditableImage({
  contentKey,
  defaultSrc,
  alt,
  className,
  page = 'global'
}: EditableImageProps) {
  const { isEditing, getContent, updateContent } = useVisualEditor();
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageSrc = getContent(contentKey, defaultSrc);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `visual-editor/${contentKey}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      updateContent(contentKey, publicUrl, 'image', page);
      toast.success('Imagem atualizada!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isEditing) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          className,
          "transition-all duration-200",
          isHovered && "ring-2 ring-primary ring-offset-2"
        )}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {isHovered && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-white">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">Enviando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-white">
              <Upload className="w-8 h-8" />
              <span className="text-sm">Clique para trocar imagem</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
