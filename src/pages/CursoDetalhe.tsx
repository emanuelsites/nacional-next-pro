import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import EnrollmentModal from '@/components/EnrollmentModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, User, Award, ArrowLeft, Calendar, BookOpen, Target } from 'lucide-react';
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
        {/* Hero Section */}
        <section className="relative h-[45vh] min-h-[350px]">
          <img 
            src={course.image_url || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80'} 
            alt={course.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/30" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-10">
              <Link to="/cursos" className="inline-flex items-center gap-2 text-background/80 hover:text-background mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Voltar aos cursos
              </Link>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-primary text-primary-foreground">{course.modality}</Badge>
                  <Badge variant="outline" className="border-background/30 text-background">{course.category}</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-background max-w-4xl leading-tight">
                  {course.title}
                </h1>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Course Info Cards */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="text-center h-full">
                  <CardContent className="pt-6 pb-4">
                    <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Data</p>
                    <p className="font-semibold text-sm">{course.course_date || 'A informar'}</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="text-center h-full">
                  <CardContent className="pt-6 pb-4">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Carga Horária</p>
                    <p className="font-semibold text-sm">{course.duration || 'A informar'}</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="text-center h-full">
                  <CardContent className="pt-6 pb-4">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Local</p>
                    <p className="font-semibold text-sm">{course.location || 'Online'}</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Card className="text-center h-full">
                  <CardContent className="pt-6 pb-4">
                    <User className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Instrutor</p>
                    <p className="font-semibold text-sm">{course.instructor || 'A informar'}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-10">
              {/* Sobre o Curso */}
              {course.full_description && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Sobre o Curso</h2>
                  </div>
                  <Card>
                    <CardContent className="p-6">
                      <div 
                        className="prose prose-gray max-w-none text-muted-foreground leading-relaxed
                          prose-headings:text-foreground prose-headings:font-semibold
                          prose-p:mb-4 prose-ul:my-4 prose-ol:my-4
                          prose-li:text-muted-foreground
                          prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: course.full_description }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Conteúdo Programático */}
              {course.content && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Conteúdo Programático</h2>
                  </div>
                  <Card>
                    <CardContent className="p-6">
                      <div 
                        className="prose prose-gray max-w-none text-muted-foreground leading-relaxed
                          prose-headings:text-foreground prose-headings:font-semibold
                          prose-p:mb-4 prose-ul:my-4 prose-ol:my-4
                          prose-li:text-muted-foreground
                          prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: course.content }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Pré-requisitos */}
              {course.prerequisites && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Card className="bg-muted/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-2">Pré-requisitos</h3>
                      <p className="text-muted-foreground">{course.prerequisites}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Certificado e CTA */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Card className="gradient-primary text-primary-foreground overflow-hidden">
                  <CardContent className="p-8 text-center">
                    {course.certificate && (
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Award className="w-6 h-6" />
                        <span className="font-semibold">Certificado Incluso</span>
                      </div>
                    )}
                    <h3 className="text-xl md:text-2xl font-bold mb-3">
                      Garanta sua vaga agora!
                    </h3>
                    <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
                      Invista no seu desenvolvimento profissional. Inscreva-se e faça parte do nosso próximo treinamento.
                    </p>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="text-primary font-semibold px-8"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Fazer Inscrição
                    </Button>
                  </CardContent>
                </Card>
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
