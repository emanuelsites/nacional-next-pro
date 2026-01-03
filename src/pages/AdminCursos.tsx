import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Search, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchCourses, deleteCourse, Course } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import CourseFormModal from '@/components/admin/CourseFormModal';

export default function AdminCursos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({ queryKey: ['admin-courses'], queryFn: fetchCourses });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast({ title: 'Curso excluído com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir curso', variant: 'destructive' });
    },
  });

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      deleteCourseMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleGenerateImage = async (course: Course) => {
    setGeneratingImageId(course.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-course-image', {
        body: {
          courseTitle: course.title,
          courseCategory: course.category,
          courseId: course.id,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast({ title: 'Imagem gerada com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({ 
        title: 'Erro ao gerar imagem', 
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive' 
      });
    } finally {
      setGeneratingImageId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="hero" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : filteredCourses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Curso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Modalidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {course.image_url && (
                          <img src={course.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{course.category}</td>
                    <td className="px-6 py-4">
                      <Badge variant={course.modality === 'Online' ? 'secondary' : 'default'}>
                        {course.modality}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={course.active ? 'default' : 'destructive'}>
                        {course.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleGenerateImage(course)}
                          disabled={generatingImageId === course.id}
                          title="Gerar imagem com IA"
                        >
                          {generatingImageId === course.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-primary" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum curso encontrado.
          </div>
        )}
      </div>

      <CourseFormModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        course={editingCourse} 
      />
    </div>
  );
}
