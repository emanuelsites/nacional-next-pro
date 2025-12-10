import { motion } from 'framer-motion';
import { Award, Users, Clock, BookOpen, Target, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Certificação Reconhecida',
    description: 'Certificados válidos em todo o território nacional, emitidos por profissionais qualificados.',
  },
  {
    icon: Users,
    title: 'Instrutores Especialistas',
    description: 'Equipe de profissionais com ampla experiência em administração pública e privada.',
  },
  {
    icon: Clock,
    title: 'Flexibilidade',
    description: 'Cursos presenciais e online, adaptados à sua disponibilidade e necessidades.',
  },
  {
    icon: BookOpen,
    title: 'Material Didático',
    description: 'Conteúdo atualizado e material de apoio completo para consulta posterior.',
  },
  {
    icon: Target,
    title: 'Foco em Resultados',
    description: 'Metodologia prática voltada para aplicação imediata no dia a dia profissional.',
  },
  {
    icon: CheckCircle,
    title: 'Qualidade Comprovada',
    description: 'Milhares de profissionais já capacitados com alto índice de satisfação.',
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que estudar na Nacional Treinamentos?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Há mais de uma década formando profissionais de excelência para a Administração Pública
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-2xl shadow-card card-hover border border-border"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}