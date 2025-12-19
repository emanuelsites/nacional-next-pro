import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Pregoeira Municipal',
    city: 'Belém/PA',
    content: 'Excelente curso! O Prof. Nazareno é muito didático e consegue explicar temas complexos de forma clara. Recomendo a todos os profissionais da área de licitações.',
    rating: 5,
  },
  {
    name: 'João Silva',
    role: 'Gestor de Patrimônio',
    city: 'Fortaleza/CE',
    content: 'O curso de Gestão Patrimonial superou minhas expectativas. Material completo e atualizado com a legislação vigente. Já apliquei vários conceitos no meu trabalho.',
    rating: 5,
  },
  {
    name: 'Ana Oliveira',
    role: 'Contadora Pública',
    city: 'São Paulo/SP',
    content: 'Participei do curso online e a experiência foi ótima. Plataforma fácil de usar, conteúdo de qualidade e suporte excelente. Nota 10!',
    rating: 5,
  },
  {
    name: 'Pedro Costa',
    role: 'Auditor Interno',
    city: 'Brasília/DF',
    content: 'A Nacional Treinamentos oferece cursos de alta qualidade. Já participei de três e todos agregaram muito ao meu conhecimento profissional.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos alunos dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira a opinião de profissionais que já se capacitaram conosco
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-2xl shadow-card border border-border relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-card-foreground mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
