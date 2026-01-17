import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { fetchActiveCourses, Course } from '@/lib/api';
import EditableCourseField from '@/components/visual-editor/EditableCourseField';

export default function HeroCarousel() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({ 
    queryKey: ['active-courses'], 
    queryFn: fetchActiveCourses 
  });
  
  // Use all courses for the carousel
  const carouselCourses = courses;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reset index when courses change
  useEffect(() => {
    if (currentIndex >= carouselCourses.length && carouselCourses.length > 0) {
      setCurrentIndex(0);
    }
  }, [carouselCourses.length, currentIndex]);

  // Autoplay - advances every 5 seconds, but pauses when editing
  useEffect(() => {
    if (carouselCourses.length <= 1 || isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselCourses.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [carouselCourses.length, isPaused]);

  const handleEditingChange = useCallback((isEditing: boolean) => {
    setIsPaused(isEditing);
  }, []);

  const goToPrevious = () => {
    if (carouselCourses.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + carouselCourses.length) % carouselCourses.length);
  };

  const goToNext = () => {
    if (carouselCourses.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % carouselCourses.length);
  };

  if (isLoading || carouselCourses.length === 0) {
    return (
      <section className="relative h-[60vh] min-h-[400px] gradient-primary flex items-center justify-center">
        <div className="text-center text-primary-foreground">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nacional Treinamentos</h1>
          <p className="text-xl opacity-80">Capacitação profissional para a Administração Pública</p>
        </div>
      </section>
    );
  }

  const currentCourse = carouselCourses[currentIndex];

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={currentCourse.image_url || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80'}
            alt={currentCourse.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full container mx-auto px-4 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl text-background"
          >

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 line-clamp-3"
            >
              <EditableCourseField
                courseId={currentCourse.id}
                field="title"
                currentValue={currentCourse.title}
                as="span"
                className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                onEditingChange={handleEditingChange}
              />
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-6 text-sm text-background/80"
            >
              <EditableCourseField
                courseId={currentCourse.id}
                field="course_date"
                currentValue={currentCourse.course_date || ''}
                as="span"
                className="text-sm"
                onEditingChange={handleEditingChange}
              />
              <span>•</span>
              <EditableCourseField
                courseId={currentCourse.id}
                field="duration"
                currentValue={currentCourse.duration || ''}
                as="span"
                className="text-sm"
                onEditingChange={handleEditingChange}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to={`/curso/${currentCourse.slug}`}>
                <Button variant="hero" size="lg" className="group">
                  Saiba Mais
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/cursos">
                <Button variant="outline" size="lg" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                  Ver Todos os Cursos
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {carouselCourses.length > 1 && (
        <>
          <button 
            onClick={goToPrevious} 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-background hover:bg-primary transition-colors z-10 cursor-pointer"
            type="button"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={goToNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-background hover:bg-primary transition-colors z-10 cursor-pointer"
            type="button"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {carouselCourses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                type="button"
                aria-label={`Ir para slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-background/50 hover:bg-background/80'}`}
              />
            ))}
          </div>
        </>
      )}

      {isPaused && (
        <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs px-3 py-1.5 rounded-full z-20">
          Autoplay pausado durante edição
        </div>
      )}
    </section>
  );
}
