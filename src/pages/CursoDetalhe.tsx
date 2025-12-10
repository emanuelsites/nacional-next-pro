import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import EnrollmentModal from '@/components/EnrollmentModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, Award, CheckCircle, ArrowLeft, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchCourseById, Course } from '@/lib/api';

export default function CursoDetalhe() {
  const { id } = useParams();
  const { data: course, isLoading } = useQuery<Course | null>({
    queryKey: ['course', id],
    queryFn: () => fetchCourseById(id!),
    enabled: !!id,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
          <Link to="/cursos">
            <Button>Voltar aos Cursos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative h-[50vh] min-h-[400px]">
          <img 
            src={course.image_url || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80'} 
            alt={course.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/30" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <Link to="/cursos" className="inline-flex items-center gap-2 text-background/80 hover:text-background mb-6">
                <ArrowLeft className="w-4 h-4" />
                Voltar aos cursos
              </Link>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-primary text-primary-foreground">{course.modality}</Badge>
                  <Badge variant="outline" className="border-background/30 text-background">{course.category}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background max-w-4xl">{course.title}</h1>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Sobre o Curso</h2>
                  <p className="text-muted-foreground leading-relaxed">{course.full_description}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Conteúdo Programático</h2>
                  <ul className="space-y-3">
                    {course.content?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border sticky top-24 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-primary" /><div><p className="text-sm text-muted-foreground">Data</p><p className="font-medium">{course.course_date}</p></div></div>
                    <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-primary" /><div><p className="text-sm text-muted-foreground">Carga Horária</p><p className="font-medium">{course.duration}</p></div></div>
                    <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /><div><p className="text-sm text-muted-foreground">Local</p><p className="font-medium">{course.location}</p></div></div>
                    <div className="flex items-center gap-3"><User className="w-5 h-5 text-primary" /><div><p className="text-sm text-muted-foreground">Instrutor</p><p className="font-medium">{course.instructor}</p></div></div>
                    {course.certificate && <div className="flex items-center gap-3"><Award className="w-5 h-5 text-primary" /><p className="font-medium">Certificado Incluso</p></div>}
                  </div>

                  {course.prerequisites && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-1">Pré-requisitos</p>
                      <p className="text-sm">{course.prerequisites}</p>
                    </div>
                  )}

                  <Button variant="hero" size="lg" className="w-full" onClick={() => setIsModalOpen(true)}>
                    Ficha de Inscrição
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <EnrollmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} course={course} />
    </div>
  );
}
