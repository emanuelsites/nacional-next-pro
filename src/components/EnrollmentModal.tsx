import { useState } from 'react';
import { X, User, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createEnrollment, Course } from '@/lib/api';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const estados = [
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
  'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
  'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
  'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
  'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
];

export default function EnrollmentModal({ isOpen, onClose, course }: EnrollmentModalProps) {
  const [type, setType] = useState<'pessoa_fisica' | 'pessoa_juridica'>('pessoa_fisica');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    nome_empresa: '',
    cnpj: '',
    telefone_fixo: '',
    telefone_celular: '',
    email: '',
    cep: '',
    endereco: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createEnrollment({
        course_id: course.id,
        course_name: course.title,
        enrollment_type: type,
        nome_completo: formData.nome_completo || null,
        cpf: formData.cpf || null,
        nome_empresa: formData.nome_empresa || null,
        cnpj: formData.cnpj || null,
        telefone_fixo: formData.telefone_fixo || null,
        telefone_celular: formData.telefone_celular,
        email: formData.email,
        cep: formData.cep || null,
        endereco: formData.endereco || null,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        uf: formData.uf || null,
      });

      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Em breve entraremos em contato com mais informações.",
      });

      onClose();
      setFormData({
        nome_completo: '', cpf: '', nome_empresa: '', cnpj: '',
        telefone_fixo: '', telefone_celular: '', email: '',
        cep: '', endereco: '', bairro: '', cidade: '', uf: '',
      });
    } catch (error) {
      toast({
        title: "Erro ao realizar inscrição",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="gradient-primary p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary-foreground">Ficha de Inscrição</h2>
                  <p className="text-primary-foreground/80 mt-1 line-clamp-1">{course.title}</p>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="flex gap-4 mb-6">
                <button type="button" onClick={() => setType('pessoa_fisica')} className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${type === 'pessoa_fisica' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}>
                  <User className="w-5 h-5" /><span className="font-medium">Pessoa Física</span>
                </button>
                <button type="button" onClick={() => setType('pessoa_juridica')} className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${type === 'pessoa_juridica' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}>
                  <Building2 className="w-5 h-5" /><span className="font-medium">Pessoa Jurídica</span>
                </button>
              </div>

              <div className="space-y-4">
                {type === 'pessoa_fisica' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="nome_completo">Nome Completo *</Label><Input id="nome_completo" name="nome_completo" value={formData.nome_completo} onChange={handleChange} required /></div>
                    <div><Label htmlFor="cpf">CPF *</Label><Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" required /></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="nome_empresa">Nome da Empresa/Órgão *</Label><Input id="nome_empresa" name="nome_empresa" value={formData.nome_empresa} onChange={handleChange} required /></div>
                    <div><Label htmlFor="cnpj">CNPJ *</Label><Input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" required /></div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="telefone_fixo">Telefone Fixo</Label><Input id="telefone_fixo" name="telefone_fixo" value={formData.telefone_fixo} onChange={handleChange} placeholder="(00) 0000-0000" /></div>
                  <div><Label htmlFor="telefone_celular">Telefone Celular *</Label><Input id="telefone_celular" name="telefone_celular" value={formData.telefone_celular} onChange={handleChange} placeholder="(00) 00000-0000" required /></div>
                </div>

                <div><Label htmlFor="email">E-mail *</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label htmlFor="cep">CEP</Label><Input id="cep" name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" /></div>
                  <div className="md:col-span-2"><Label htmlFor="endereco">Endereço Completo</Label><Input id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label htmlFor="bairro">Bairro</Label><Input id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} /></div>
                  <div><Label htmlFor="cidade">Cidade</Label><Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} /></div>
                  <div><Label htmlFor="uf">UF</Label><Select onValueChange={(value) => setFormData(prev => ({ ...prev, uf: value }))}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{estados.map(estado => (<SelectItem key={estado} value={estado}>{estado}</SelectItem>))}</SelectContent></Select></div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
                <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Enviar Inscrição'}</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
