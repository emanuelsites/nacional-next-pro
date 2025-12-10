import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, TrendingUp, Calendar } from 'lucide-react';
import { fetchCourses, fetchEnrollments } from '@/lib/api';

export default function AdminDashboard() {
  const { data: courses = [] } = useQuery({ queryKey: ['admin-courses'], queryFn: fetchCourses });
  const { data: enrollments = [] } = useQuery({ queryKey: ['admin-enrollments'], queryFn: fetchEnrollments });

  const stats = [
    { name: 'Total de Cursos', value: courses.length, icon: BookOpen, color: 'bg-primary' },
    { name: 'Cursos Ativos', value: courses.filter(c => c.active).length, icon: TrendingUp, color: 'bg-accent' },
    { name: 'Total de Inscritos', value: enrollments.length, icon: Users, color: 'bg-secondary' },
    { name: 'Inscrições Pendentes', value: enrollments.filter(e => e.status === 'pending').length, icon: Calendar, color: 'bg-destructive' },
  ];

  const recentEnrollments = enrollments.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-card rounded-xl p-6 shadow-card border border-border">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Enrollments */}
      <div className="bg-card rounded-xl shadow-card border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Inscrições Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          {recentEnrollments.length > 0 ? (
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Curso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">E-mail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentEnrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {enrollment.nome_completo || enrollment.nome_empresa || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {enrollment.course_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {enrollment.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {enrollment.created_at ? new Date(enrollment.created_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma inscrição encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
