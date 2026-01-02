import { motion } from 'framer-motion';
import { Award, Users, Clock, BookOpen, Target, CheckCircle } from 'lucide-react';
import EditableText from '@/components/visual-editor/EditableText';

const features = [
  {
    key: 'certification',
    icon: Award,
    defaultTitle: 'Certificação Reconhecida',
    defaultDescription: 'Certificados válidos em todo o território nacional, emitidos por profissionais qualificados.',
  },
  {
    key: 'instructors',
    icon: Users,
    defaultTitle: 'Instrutores Especialistas',
    defaultDescription: 'Equipe de profissionais com ampla experiência em administração pública e privada.',
  },
  {
    key: 'flexibility',
    icon: Clock,
    defaultTitle: 'Flexibilidade',
    defaultDescription: 'Cursos presenciais e online, adaptados à sua disponibilidade e necessidades.',
  },
  {
    key: 'material',
    icon: BookOpen,
    defaultTitle: 'Material Didático',
    defaultDescription: 'Conteúdo atualizado e material de apoio completo para consulta posterior.',
  },
  {
    key: 'results',
    icon: Target,
    defaultTitle: 'Foco em Resultados',
    defaultDescription: 'Metodologia prática voltada para aplicação imediata no dia a dia profissional.',
  },
  {
    key: 'quality',
    icon: CheckCircle,
    defaultTitle: 'Qualidade Comprovada',
    defaultDescription: 'Milhares de profissionais já capacitados com alto índice de satisfação.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <EditableText
            contentKey="why_choose_title"
            defaultValue="Por que estudar na Nacional Treinamentos?"
            as="h2"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            page="home"
            allowFormatting
          />
          <EditableText
            contentKey="why_choose_subtitle"
            defaultValue="Há mais de uma década formando profissionais de excelência para a Administração Pública"
            as="p"
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            page="home"
            allowFormatting
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-2xl shadow-card card-hover border border-border"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <EditableText
                contentKey={`why_choose_${feature.key}_title`}
                defaultValue={feature.defaultTitle}
                as="h3"
                className="text-xl font-bold text-card-foreground mb-3"
                page="home"
              />
              <EditableText
                contentKey={`why_choose_${feature.key}_description`}
                defaultValue={feature.defaultDescription}
                as="p"
                className="text-muted-foreground leading-relaxed"
                page="home"
                allowFormatting
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
