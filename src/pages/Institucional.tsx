import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';
import { Award, Users, Target, Heart } from 'lucide-react';

export default function Institucional() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="gradient-primary py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Institucional
            </motion.h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">Quem Somos</h2>
              <p className="text-muted-foreground mb-8">
                A Nacional Treinamentos é uma empresa fundada por profissionais oriundos de empresas de auditoria e consultoria, 
                com sólida experiência em empresas nacionais e transnacionais. Há mais de uma década capacitamos profissionais 
                da Administração Pública em todo o Brasil.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                {[
                  { icon: Target, title: 'Missão', text: 'Capacitar profissionais com excelência, contribuindo para uma gestão pública mais eficiente.' },
                  { icon: Heart, title: 'Valores', text: 'Ética, transparência, compromisso com a qualidade e respeito ao cliente.' },
                  { icon: Award, title: 'Visão', text: 'Ser referência nacional em treinamentos para a Administração Pública.' },
                  { icon: Users, title: 'Diferenciais', text: 'Instrutores especialistas, material atualizado e metodologia prática.' },
                ].map((item, index) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card p-6 rounded-xl shadow-card border border-border">
                    <item.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
