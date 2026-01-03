import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import EditableText from '@/components/visual-editor/EditableText';
import officeImage from '@/assets/office-team.jpg';

export default function AboutSection() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Office Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse -z-10" />
              
              {/* Image */}
              <img
                src={officeImage}
                alt="Profissionais trabalhando em escritório"
                className="w-full h-auto rounded-2xl object-cover"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            </div>

            {/* Decorative */}
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl gradient-primary opacity-20" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-primary/10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <EditableText
              contentKey="about_title"
              defaultValue="Há 18 anos capacitando profissionais para a Administração Pública"
              as="h2"
              className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight"
              page="home"
              allowFormatting
            />

            <EditableText
              contentKey="about_description_1"
              defaultValue="A Nacional Treinamentos é uma empresa fundada por profissionais oriundos de empresas de auditoria e consultoria, com sólida experiência em empresas nacionais e transnacionais."
              as="p"
              className="text-muted-foreground text-lg leading-relaxed mb-6 text-left"
              page="home"
              allowFormatting
            />

            <EditableText
              contentKey="about_description_2"
              defaultValue="Nossa missão é capacitar servidores públicos e profissionais da iniciativa privada com conhecimentos atualizados e práticos, contribuindo para uma gestão pública mais eficiente, transparente e moderna. Oferecemos cursos presenciais em diversas capitais do Brasil e também na modalidade online, com a mesma qualidade e excelência."
              as="p"
              className="text-muted-foreground leading-relaxed mb-8 text-left"
              page="home"
              allowFormatting
            />

            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { key: 'stat_professionals', value: '5.000+', label: 'Profissionais capacitados' },
                { key: 'stat_courses', value: '50+', label: 'Cursos disponíveis' },
                { key: 'stat_states', value: '27', label: 'Estados atendidos' },
                { key: 'stat_satisfaction', value: '98%', label: 'Taxa de satisfação' },
              ].map((stat) => (
                <div key={stat.key} className="text-center p-4 rounded-xl bg-muted">
                  <EditableText
                    contentKey={`about_${stat.key}_value`}
                    defaultValue={stat.value}
                    as="div"
                    className="text-2xl font-bold text-primary"
                    page="home"
                  />
                  <EditableText
                    contentKey={`about_${stat.key}_label`}
                    defaultValue={stat.label}
                    as="p"
                    className="text-sm text-muted-foreground"
                    page="home"
                  />
                </div>
              ))}
            </div>

            <Link to="/institucional">
              <Button variant="hero" size="lg" className="group">
                Saiba Mais Sobre Nós
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
