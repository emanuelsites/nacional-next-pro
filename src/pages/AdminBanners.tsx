import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link: string | null;
  active: boolean;
  position: number;
  created_at: string;
}

const fetchBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('position', { ascending: true });
  if (error) throw error;
  return data || [];
};

const createBanner = async (banner: Omit<Banner, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('banners').insert([banner]).select().single();
  if (error) throw error;
  return data;
};

const updateBanner = async ({ id, ...banner }: Partial<Banner> & { id: string }) => {
  const { data, error } = await supabase.from('banners').update(banner).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

const deleteBanner = async (id: string) => {
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw error;
};

export default function AdminBanners() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: banners = [], isLoading } = useQuery({ queryKey: ['admin-banners'], queryFn: fetchBanners });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      toast({ title: 'Banner excluído com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir banner', variant: 'destructive' });
    },
  });

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Gestão de Banners</h2>
        <Button variant="hero" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Banner
        </Button>
      </div>

      {/* Banners Grid */}
      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : banners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-muted rounded-lg overflow-hidden border border-border">
                {banner.image_url && (
                  <img 
                    src={banner.image_url} 
                    alt={banner.title} 
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground truncate">{banner.title}</h3>
                    <Badge variant={banner.active ? 'default' : 'destructive'}>
                      {banner.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  {banner.subtitle && (
                    <p className="text-sm text-muted-foreground truncate mb-2">{banner.subtitle}</p>
                  )}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(banner)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(banner.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum banner cadastrado.
          </div>
        )}
      </div>

      <BannerFormModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        banner={editingBanner} 
      />
    </div>
  );
}

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: Banner | null;
}

function BannerFormModal({ isOpen, onClose, banner }: BannerFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!banner;

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link: '',
    active: true,
    position: 0,
  });

  useState(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        image_url: banner.image_url || '',
        link: banner.link || '',
        active: banner.active ?? true,
        position: banner.position ?? 0,
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        image_url: '',
        link: '',
        active: true,
        position: 0,
      });
    }
  });

  // Reset form when banner changes
  if (isOpen && banner && formData.title !== banner.title) {
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image_url: banner.image_url || '',
      link: banner.link || '',
      active: banner.active ?? true,
      position: banner.position ?? 0,
    });
  }

  if (isOpen && !banner && formData.title !== '') {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link: '',
      active: true,
      position: 0,
    });
  }

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      toast({ title: 'Banner criado com sucesso!' });
      onClose();
    },
    onError: () => {
      toast({ title: 'Erro ao criar banner', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      toast({ title: 'Banner atualizado com sucesso!' });
      onClose();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar banner', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && banner) {
      updateMutation.mutate({ id: banner.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="gradient-primary p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary-foreground">
                {isEditing ? 'Editar Banner' : 'Novo Banner'}
              </h2>
              <button onClick={onClose} className="text-primary-foreground/80 hover:text-primary-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input 
                  id="subtitle" 
                  value={formData.subtitle} 
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} 
                />
              </div>

              <div>
                <Label>Imagem do Banner</Label>
                <ImageUpload 
                  value={formData.image_url} 
                  onChange={(url) => setFormData({ ...formData, image_url: url })} 
                  folder="banners"
                />
              </div>

              <div>
                <Label htmlFor="link">Link (opcional)</Label>
                <Input 
                  id="link" 
                  value={formData.link} 
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })} 
                  type="url"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="position">Posição</Label>
                <Input 
                  id="position" 
                  type="number"
                  value={formData.position} 
                  onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })} 
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch 
                  checked={formData.active} 
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} 
                />
                <Label>Ativo</Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : (isEditing ? 'Salvar' : 'Criar')}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}