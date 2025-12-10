import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Course } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
  index?: number;
}

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group bg-card rounded-2xl overflow-hidden shadow-card card-hover border border-border"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image_url || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80'}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className={`${
            course.modality === 'Online' 
              ? 'bg-accent text-accent-foreground' 
              : course.modality === 'Presencial'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}>
            {course.modality}
          </Badge>
          {course.featured && (
            <Badge className="bg-destructive text-destructive-foreground">
              Destaque
            </Badge>
          )}
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-background text-sm">
            <Calendar className="w-4 h-4" />
            <span>{course.course_date}</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <p className="text-xs text-primary font-medium uppercase tracking-wide">{course.category}</p>
        <h3 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{course.duration}</span>
          </div>
          <span>•</span>
          <span>{course.modality}</span>
        </div>

        <Link to={`/curso/${course.id}`}>
          <Button variant="outline" size="sm" className="w-full mt-2">
            Ver Detalhes
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
