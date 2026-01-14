import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createCourse, updateCourse, fetchCourseById, Course, categories } from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface LocationDate {
  location: string;
  date: string;
}

export default function AdminCourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourseById(id!),
    enabled: isEditing,
  });

  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    content: '',
    category: 'Licitações / Contratos',
    duration: '',
    modality: 'Presencial',
    instructor: '',
    certificate: true,
    image_url: '',
    featured: false,
    active: true,
  });

  const [locationDates, setLocationDates] = useState<LocationDate[]>([
    { location: '', date: '' }
  ]);

  useEffect(() => {
    if (course) {
      // Parse existing location and date data
      let parsedLocationDates: LocationDate[] = [{ location: '', date: '' }];
      
      // Try to parse location as JSON array, otherwise use as single entry
      try {
        const locationData = course.location;
        if (locationData && locationData.startsWith('[')) {
          parsedLocationDates = JSON.parse(locationData);
        } else if (locationData || course.course_date) {
          parsedLocationDates = [{
            location: course.location || '',
            date: course.course_date || ''
          }];
        }
      } catch {
        parsedLocationDates = [{
          location: course.location || '',
          date: course.course_date || ''
        }];
      }

      setFormData({
        title: course.title || '',
        short_description: course.short_description || '',
        full_description: course.full_description || '',
        content: course.content || '',
        category: course.category || 'Licitações / Contratos',
        duration: course.duration || '',
        modality: course.modality || 'Presencial',
        instructor: course.instructor || '',
        certificate: course.certificate ?? true,
        image_url: course.image_url || '',
        featured: course.featured ?? false,
        active: course.active ?? true,
      });
      
      setLocationDates(parsedLocationDates.length > 0 ? parsedLocationDates : [{ location: '', date: '' }]);
    }
  }, [course]);

  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast({ title: 'Curso criado com sucesso!' });
      navigate('/admin/cursos');
    },
    onError: () => {
      toast({ title: 'Erro ao criar curso', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) => updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      toast({ title: 'Curso atualizado com sucesso!' });
      navigate('/admin/cursos');
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar curso', variant: 'destructive' });
    },
  });

  const handleAddLocationDate = () => {
    setLocationDates([...locationDates, { location: '', date: '' }]);
  };

  const handleRemoveLocationDate = (index: number) => {
    if (locationDates.length > 1) {
      setLocationDates(locationDates.filter((_, i) => i !== index));
    }
  };

  const handleLocationDateChange = (index: number, field: 'location' | 'date', value: string) => {
    const updated = [...locationDates];
    updated[index][field] = value;
    setLocationDates(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store location data as JSON string for multiple entries, or simple string for single
    const locationData = locationDates.length === 1 
      ? locationDates[0].location 
      : JSON.stringify(locationDates);
    
    const dateData = locationDates.length === 1 
      ? locationDates[0].date 
      : JSON.stringify(locationDates.map(ld => ld.date));

    const submitData = {
      ...formData,
      location: locationData,
      course_date: dateData,
    };
    
    if (isEditing && id) {
      updateMutation.mutate({ id, data: submitData });
    } else {
      createMutation.mutate(submitData as any);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingCourse) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/cursos')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Editar Curso' : 'Novo Curso'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-card border border-border p-6 space-y-6">
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

        {/* Local e Data - Multiple entries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Local e Data</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddLocationDate}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
          
          <div className="space-y-3">
            {locationDates.map((item, index) => (
              <div key={index} className="flex gap-3 items-start p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`location-${index}`} className="text-xs text-muted-foreground">Local</Label>
                    <Input 
                      id={`location-${index}`}
                      value={item.location} 
                      onChange={(e) => handleLocationDateChange(index, 'location', e.target.value)}
                      placeholder="Ex: São Paulo - SP"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`date-${index}`} className="text-xs text-muted-foreground">Data e Horário</Label>
                    <Input 
                      id={`date-${index}`}
                      value={item.date} 
                      onChange={(e) => handleLocationDateChange(index, 'date', e.target.value)}
                      placeholder="Ex: 27 a 29/01/2026 - 08h às 17h"
                    />
                  </div>
                </div>
                {locationDates.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveLocationDate(index)}
                    className="text-destructive hover:text-destructive mt-5"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Carga Horária</Label>
            <Input 
              id="duration" 
              value={formData.duration} 
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })} 
              placeholder="Ex: 24 horas" 
            />
          </div>
          <div>
            <Label htmlFor="instructor">Instrutor</Label>
            <Input 
              id="instructor" 
              value={formData.instructor} 
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} 
            />
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

        <div className="flex gap-4 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/cursos')} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
            {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Curso')}
          </Button>
        </div>
      </form>
    </div>
  );
}
