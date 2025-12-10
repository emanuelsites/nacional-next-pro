import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchEnrollments, deleteEnrollment, Enrollment } from '@/lib/api';

export default function AdminInscritos() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: enrollments = [], isLoading } = useQuery({ queryKey: ['admin-enrollments'], queryFn: fetchEnrollments });

  const deleteEnrollmentMutation = useMutation({
    mutationFn: deleteEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-enrollments'] });
      toast({ title: 'Inscrição excluída com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir inscrição', variant: 'destructive' });
    },
  });

  const filteredEnrollments = enrollments.filter(enrollment =>
    (enrollment.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.nome_empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta inscrição?')) {
      deleteEnrollmentMutation.mutate(id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Nome', 'Tipo', 'Curso', 'Email', 'Telefone', 'Cidade', 'UF', 'Data'];
    const rows = filteredEnrollments.map(e => [
      e.nome_completo || e.nome_empresa || '',
      e.enrollment_type === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
      e.course_name,
      e.email,
      e.telefone_celular,
      e.cidade || '',
      e.uf || '',
      e.created_at ? new Date(e.created_at).toLocaleDateString('pt-BR') : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inscritos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({ title: 'Exportação concluída!' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar inscritos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : filteredEnrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Curso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Data</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        {enrollment.nome_completo || enrollment.nome_empresa || '-'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.cpf || enrollment.cnpj || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                      {enrollment.course_name}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{enrollment.email}</p>
                      <p className="text-sm text-muted-foreground">{enrollment.telefone_celular}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">
                        {enrollment.enrollment_type === 'pessoa_fisica' ? 'PF' : 'PJ'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {enrollment.created_at ? new Date(enrollment.created_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(enrollment.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Nenhuma inscrição encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
