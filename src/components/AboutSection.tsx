import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import EditableText from '@/components/visual-editor/EditableText';
import logo from '@/assets/logo.png';

export default function AboutSection() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Logo with Effects */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center"
          >
            <div className="relative p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-3xl animate-pulse" />
              
              {/* Logo */}
              <motion.img
                src={logo}
                alt="Nacional Treinamentos"
                className="relative z-10 w-80 h-auto drop-shadow-2xl"
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
              
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-4 rounded-full border border-primary/10" />
            </div>
            
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -right-8 bg-card p-8 rounded-2xl shadow-xl border border-border"
            >
              <EditableText
                contentKey="about_years"
                defaultValue="+18"
                as="div"
                className="text-4xl font-bold text-primary mb-2"
                page="home"
              />
              <EditableText
                contentKey="about_years_label"
                defaultValue="Anos de experiência"
                as="p"
                className="text-muted-foreground"
                page="home"
              />
            </motion.div>

            {/* Decorative */}
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl gradient-primary opacity-20" />
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
              defaultValue="Capacitando profissionais para a Administração Pública"
              as="h2"
              className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight text-center lg:text-left"
              page="home"
              allowFormatting
            />

            <EditableText
              contentKey="about_description_1"
              defaultValue="A Nacional Treinamentos é uma empresa fundada por profissionais oriundos de empresas de auditoria e consultoria, com sólida experiência em empresas nacionais e transnacionais."
              as="p"
              className="text-muted-foreground text-lg leading-relaxed mb-6"
              page="home"
              allowFormatting
            />

            <EditableText
              contentKey="about_description_2"
              defaultValue="Nossa missão é capacitar servidores públicos e profissionais da iniciativa privada com conhecimentos atualizados e práticos, contribuindo para uma gestão pública mais eficiente, transparente e moderna. Oferecemos cursos presenciais em diversas capitais do Brasil e também na modalidade online, com a mesma qualidade e excelência."
              as="p"
              className="text-muted-foreground leading-relaxed mb-8"
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
