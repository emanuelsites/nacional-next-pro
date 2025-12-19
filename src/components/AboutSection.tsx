import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AboutSection() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="Equipe Nacional Treinamentos"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -right-8 bg-card p-8 rounded-2xl shadow-xl border border-border"
            >
              <div className="text-4xl font-bold text-primary mb-2">+10</div>
              <p className="text-muted-foreground">Anos de experiência</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Capacitando profissionais para a{' '}
              <span className="text-gradient">Administração Pública</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              A Nacional Treinamentos é uma empresa fundada por profissionais oriundos de empresas 
              de auditoria e consultoria, com sólida experiência em empresas nacionais e transnacionais.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Nossa missão é capacitar servidores públicos e profissionais da iniciativa privada 
              com conhecimentos atualizados e práticos, contribuindo para uma gestão pública mais 
              eficiente, transparente e moderna. Oferecemos cursos presenciais em diversas capitais 
              do Brasil e também na modalidade online, com a mesma qualidade e excelência.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { value: '5.000+', label: 'Profissionais capacitados' },
                { value: '50+', label: 'Cursos disponíveis' },
                { value: '27', label: 'Estados atendidos' },
                { value: '98%', label: 'Taxa de satisfação' },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-muted">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
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
