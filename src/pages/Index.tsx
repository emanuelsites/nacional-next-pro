import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroCarousel from '@/components/HeroCarousel';
import AboutSection from '@/components/AboutSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchActiveCourses, Course } from '@/lib/api';

const Index = () => {
  const { data: courses = [] } = useQuery<Course[]>({ 
    queryKey: ['active-courses'], 
    queryFn: fetchActiveCourses 
  });

  const featuredCourses = courses.filter(c => c.featured);

  return (
    <div className="min-h-screen bg-background pt-[var(--admin-bar-height,0px)]">
      <Header />
      <main>
        <HeroCarousel />
        
        {/* Featured Courses */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nossos cursos mais procurados
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.slice(0, 3).map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/cursos">
                <Button variant="hero" size="lg" className="group">
                  Ver Todos os Cursos
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <AboutSection />
        <WhyChooseUs />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
