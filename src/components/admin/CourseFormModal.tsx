import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createCourse, updateCourse, Course, categories } from '@/lib/api';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export default function CourseFormModal({ isOpen, onClose, course }: CourseFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!course;

  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    content: '',
    category: 'Licitações / Contratos',
    location: '',
    course_date: '',
    duration: '',
    modality: 'Presencial',
    instructor: '',
    certificate: true,
    prerequisites: '',
    image_url: '',
    featured: false,
    active: true,
  });

  useEffect(() => {
    if (isOpen && course) {
      setFormData({
        title: course.title || '',
        short_description: course.short_description || '',
        full_description: course.full_description || '',
        content: course.content || '',
        category: course.category || 'Licitações / Contratos',
        location: course.location || '',
        course_date: course.course_date || '',
        duration: course.duration || '',
        modality: course.modality || 'Presencial',
        instructor: course.instructor || '',
        certificate: course.certificate ?? true,
        prerequisites: course.prerequisites || '',
        image_url: course.image_url || '',
        featured: course.featured ?? false,
        active: course.active ?? true,
      });
    } else if (isOpen && !course) {
      setFormData({
        title: '',
        short_description: '',
        full_description: '',
        content: '',
        category: 'Licitações / Contratos',
        location: '',
        course_date: '',
        duration: '',
        modality: 'Presencial',
        instructor: '',
        certificate: true,
        prerequisites: '',
        image_url: '',
        featured: false,
        active: true,
      });
    }
  }, [isOpen, course]);

  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast({ title: 'Curso criado com sucesso!' });
      onClose();
    },
    onError: () => {
      toast({ title: 'Erro ao criar curso', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) => updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast({ title: 'Curso atualizado com sucesso!' });
      onClose();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar curso', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && course) {
      updateMutation.mutate({ id: course.id, data: formData });
    } else {
      createMutation.mutate(formData as any);
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
            className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="gradient-primary p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary-foreground">
                {isEditing ? 'Editar Curso' : 'Novo Curso'}
              </h2>
              <button onClick={onClose} className="text-primary-foreground/80 hover:text-primary-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div>
                <Label>Imagem do Curso</Label>
                <ImageUpload 
                  value={formData.image_url} 
                  onChange={(url) => setFormData({ ...formData, image_url: url })} 
                  folder="courses"
                />
              </div>

              <div>
                <Label>Descrição Curta</Label>
                <RichTextEditor 
                  value={formData.short_description} 
                  onChange={(value) => setFormData({ ...formData, short_description: value })} 
                  placeholder="Digite uma descrição curta..."
                />
              </div>

              <div>
                <Label>Descrição Completa</Label>
                <RichTextEditor 
                  value={formData.full_description} 
                  onChange={(value) => setFormData({ ...formData, full_description: value })} 
                  placeholder="Digite a descrição completa do curso..."
                />
              </div>

              <div>
                <Label>Conteúdo Programático</Label>
                <RichTextEditor 
                  value={formData.content} 
                  onChange={(value) => setFormData({ ...formData, content: value })} 
                  placeholder="Digite o conteúdo programático..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'Todos').map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="modality">Modalidade</Label>
                  <Select value={formData.modality} onValueChange={(value) => setFormData({ ...formData, modality: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Presencial">Presencial</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Híbrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="location">Local</Label>
                  <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="course_date">Data</Label>
                  <Input id="course_date" value={formData.course_date} onChange={(e) => setFormData({ ...formData, course_date: e.target.value })} placeholder="Ex: 27 a 29/01/2026" />
                </div>
                <div>
                  <Label htmlFor="duration">Carga Horária</Label>
                  <Input id="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="Ex: 24 horas" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instructor">Instrutor</Label>
                  <Input id="instructor" value={formData.instructor} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="prerequisites">Pré-requisitos</Label>
                  <Input id="prerequisites" value={formData.prerequisites} onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })} />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={formData.certificate} onCheckedChange={(checked) => setFormData({ ...formData, certificate: checked })} />
                  <Label>Certificado</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
                  <Label>Destaque</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} />
                  <Label>Ativo</Label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
                <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Curso')}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}