import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';

export default function HeroCarousel() {
  const { courses } = useData();
  const featuredCourses = courses.filter(c => c.featured && c.active).slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCourses.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredCourses.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredCourses.length) % featuredCourses.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredCourses.length);
  };

  if (featuredCourses.length === 0) return null;

  const currentCourse = featuredCourses[currentIndex];

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      {/* Background Images */}
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
            src={currentCourse.image}
            alt={currentCourse.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
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
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-6"
            >
              {currentCourse.modality === 'Online' ? 'Curso Online' : `Curso ${currentCourse.modality}`}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              {currentCourse.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-background/80 mb-8 max-w-2xl"
            >
              {currentCourse.shortDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 mb-8 text-background/90"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{currentCourse.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{currentCourse.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{currentCourse.date}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to={`/curso/${currentCourse.id}`}>
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

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-background hover:bg-primary transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-background hover:bg-primary transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {featuredCourses.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-background/50 hover:bg-background/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
