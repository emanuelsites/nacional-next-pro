import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import EnrollmentModal from '@/components/EnrollmentModal';
import EditableCourseField from '@/components/visual-editor/EditableCourseField';
import EditableCourseRichText from '@/components/visual-editor/EditableCourseRichText';
import EditableCourseImage from '@/components/visual-editor/EditableCourseImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, User, Award, ArrowLeft, Calendar, BookOpen, Target, Printer, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchCourseBySlug, Course } from '@/lib/api';

export default function CursoDetalhe() {
  const { slug } = useParams();
  const { data: course, isLoading } = useQuery<Course | null>({
    queryKey: ['course', slug],
    queryFn: () => fetchCourseBySlug(slug!),
    enabled: !!slug,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!course) return;
    const url = window.location.href;
    const text = `Confira este curso: *${course.title}*\n\n📅 Data: ${course.course_date || 'A informar'}\n⏱️ Carga Horária: ${course.duration || 'A informar'}\n📍 Local: ${course.location || 'Online'}\n\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

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
    <div className="min-h-screen bg-background pt-[var(--admin-bar-height,0px)]">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[45vh] min-h-[350px]">
          <EditableCourseImage
            courseId={course.id}
            currentImageUrl={course.image_url || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80'}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/30" />
          
          {/* Print and Share buttons */}
          <div className="absolute top-4 right-4 flex gap-2 print:hidden z-50">
            <Button 
              variant="default" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePrint();
              }}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShareWhatsApp();
              }}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>

          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-10">
              <Link to="/cursos" className="inline-flex items-center gap-2 text-background/80 hover:text-background mb-4 transition-colors print:hidden">
                <ArrowLeft className="w-4 h-4" />
                Voltar aos cursos
              </Link>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-primary text-primary-foreground">
                    <EditableCourseField
                      courseId={course.id}
                      field="modality"
                      currentValue={course.modality || 'Online'}
                      as="span"
                      className="text-xs"
                    />
                  </Badge>
                  <Badge variant="outline" className="border-background/30 text-background">
                    <EditableCourseField
                      courseId={course.id}
                      field="category"
                      currentValue={course.category}
                      as="span"
                      className="text-xs"
                    />
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-background max-w-4xl leading-tight">
                  <EditableCourseField
                    courseId={course.id}
                    field="title"
                    currentValue={course.title}
                    as="span"
                    className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                  />
                </h1>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Course Info Cards */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="h-full">
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Local e Data</p>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <p className="font-semibold">
                              <EditableCourseField
                                courseId={course.id}
                                field="location"
                                currentValue={course.location || 'Online'}
                                as="span"
                                className="font-semibold"
                              />
                            </p>
                            <p className="text-muted-foreground">
                              <EditableCourseField
                                courseId={course.id}
                                field="course_date"
                                currentValue={course.course_date || 'A informar'}
                                as="span"
                                className="text-muted-foreground"
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="text-center h-full">
                  <CardContent className="pt-6 pb-4">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Carga Horária</p>
                    <p className="font-semibold text-sm">
                      <EditableCourseField
                        courseId={course.id}
                        field="duration"
                        currentValue={course.duration || 'A informar'}
                        as="span"
                        className="font-semibold"
                      />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="text-center h-full">
                  <CardContent className="pt-6 pb-4">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Modalidade</p>
                    <p className="font-semibold text-sm">
                      <EditableCourseField
                        courseId={course.id}
                        field="modality"
                        currentValue={course.modality || 'Online'}
                        as="span"
                        className="font-semibold"
                      />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            {/* Instrutor em linha separada */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.25 }}
              className="mt-4"
            >
              <Card className="text-center">
                <CardContent className="pt-6 pb-4">
                  <User className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Instrutor</p>
                  <p className="font-semibold text-sm">
                    <EditableCourseField
                      courseId={course.id}
                      field="instructor"
                      currentValue={course.instructor || 'A informar'}
                      as="span"
                      className="font-semibold"
                    />
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-10">
              {/* Sobre o Curso */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Sobre o Curso</h2>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <EditableCourseRichText
                      courseId={course.id}
                      field="full_description"
                      currentValue={course.full_description || '<p>Descrição do curso não disponível.</p>'}
                      className="course-content max-w-none text-muted-foreground"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Conteúdo Programático */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Conteúdo Programático</h2>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <EditableCourseRichText
                      courseId={course.id}
                      field="content"
                      currentValue={course.content || '<p>Conteúdo programático não disponível.</p>'}
                      className="course-content max-w-none text-muted-foreground"
                    />
                  </CardContent>
                </Card>
              </motion.div>

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
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
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
