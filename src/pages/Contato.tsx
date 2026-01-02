import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import EditableText from '@/components/visual-editor/EditableText';

export default function Contato() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({ title: "Mensagem enviada!", description: "Entraremos em contato em breve." });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-[var(--admin-bar-height,0px)]">
      <Header />
      <main>
        <section className="gradient-primary py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              <EditableText contentKey="contato-titulo" defaultValue="Entre em Contato" as="span" />
            </motion.h1>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  <EditableText contentKey="contato-info-titulo" defaultValue="Informações de Contato" as="span" />
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">E-mail</p>
                      <EditableText 
                        contentKey="contato-email" 
                        defaultValue="contato@nacionaltreinamentos.com.br" 
                        className="text-muted-foreground hover:text-primary"
                        as="span"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Telefones</p>
                      <EditableText contentKey="contato-telefone1" defaultValue="(85) 4042-2452" className="text-muted-foreground" as="p" />
                      <EditableText contentKey="contato-telefone2" defaultValue="(85) 98933-0489" className="text-muted-foreground" as="p" />
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Localização</p>
                      <EditableText contentKey="contato-localizacao" defaultValue="Fortaleza, Ceará - Brasil" className="text-muted-foreground" as="p" />
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Horário</p>
                      <EditableText contentKey="contato-horario" defaultValue="Segunda a Sexta: 8h às 18h" className="text-muted-foreground" as="p" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 rounded-xl overflow-hidden h-64">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853743783!2d-38.63372883281249!3d-3.7899264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74c3f245bbfeb%3A0x8aa56d8bf73bcb9e!2sFortaleza%2C%20CE!5e0!3m2!1spt-BR!2sbr!4v1702000000000!5m2!1spt-BR!2sbr" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="bg-card p-8 rounded-2xl shadow-card border border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    <EditableText contentKey="contato-form-titulo" defaultValue="Envie sua Mensagem" as="span" />
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div><Label htmlFor="name">Nome Completo</Label><Input id="name" required /></div>
                    <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required /></div>
                    <div><Label htmlFor="phone">Telefone</Label><Input id="phone" /></div>
                    <div><Label htmlFor="subject">Assunto</Label><Input id="subject" required /></div>
                    <div><Label htmlFor="message">Mensagem</Label><Textarea id="message" rows={5} required /></div>
                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
