import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import EditableText from '@/components/visual-editor/EditableText';

const testimonials = [
  {
    key: 'testimonial_1',
    defaultName: 'Maria Santos',
    defaultRole: 'Pregoeira Municipal',
    defaultCity: 'Belém/PA',
    defaultContent: 'Excelente curso! O Prof. Nazareno é muito didático e consegue explicar temas complexos de forma clara. Recomendo a todos os profissionais da área de licitações.',
    rating: 5,
  },
  {
    key: 'testimonial_2',
    defaultName: 'João Silva',
    defaultRole: 'Gestor de Patrimônio',
    defaultCity: 'Fortaleza/CE',
    defaultContent: 'O curso de Gestão Patrimonial superou minhas expectativas. Material completo e atualizado com a legislação vigente. Já apliquei vários conceitos no meu trabalho.',
    rating: 5,
  },
  {
    key: 'testimonial_3',
    defaultName: 'Ana Oliveira',
    defaultRole: 'Contadora Pública',
    defaultCity: 'São Paulo/SP',
    defaultContent: 'Participei do curso online e a experiência foi ótima. Plataforma fácil de usar, conteúdo de qualidade e suporte excelente. Nota 10!',
    rating: 5,
  },
  {
    key: 'testimonial_4',
    defaultName: 'Pedro Costa',
    defaultRole: 'Auditor Interno',
    defaultCity: 'Brasília/DF',
    defaultContent: 'A Nacional Treinamentos oferece cursos de alta qualidade. Já participei de três e todos agregaram muito ao meu conhecimento profissional.',
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
          <EditableText
            contentKey="testimonials_title"
            defaultValue="O que nossos alunos dizem"
            as="h2"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            page="home"
            allowFormatting
          />
          <EditableText
            contentKey="testimonials_subtitle"
            defaultValue="Confira a opinião de profissionais que já se capacitaram conosco"
            as="p"
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            page="home"
            allowFormatting
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.key}
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

              <EditableText
                contentKey={`${testimonial.key}_content`}
                defaultValue={`"${testimonial.defaultContent}"`}
                as="p"
                className="text-card-foreground mb-6 leading-relaxed italic"
                page="home"
                allowFormatting
              />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.defaultName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <EditableText
                    contentKey={`${testimonial.key}_name`}
                    defaultValue={testimonial.defaultName}
                    as="p"
                    className="font-semibold text-card-foreground"
                    page="home"
                  />
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <EditableText
                      contentKey={`${testimonial.key}_role`}
                      defaultValue={testimonial.defaultRole}
                      as="span"
                      page="home"
                    />
                    <span>•</span>
                    <EditableText
                      contentKey={`${testimonial.key}_city`}
                      defaultValue={testimonial.defaultCity}
                      as="span"
                      page="home"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
