import { useState } from 'react';
import { X, User, Building2, Plus, Trash2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createEnrollment, sendEnrollmentEmail, Course } from '@/lib/api';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

interface Participante {
  nome: string;
  telefone_comercial: string;
  telefone_celular: string;
  email: string;
}

const emptyParticipante: Participante = { nome: '', telefone_comercial: '', telefone_celular: '', email: '' };

export default function EnrollmentModal({ isOpen, onClose, course }: EnrollmentModalProps) {
  const [type, setType] = useState<'pessoa_fisica' | 'pessoa_juridica'>('pessoa_fisica');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Pessoa Física/Jurídica - Dados da empresa ou pessoa
  const [dadosGerais, setDadosGerais] = useState({
    razao_social: '',
    endereco: '',
    bairro: '',
    cep: '',
    cidade: '',
    uf: '',
    cnpj_cpf: '',
    telefone_comercial: '',
    telefone_celular: '',
    email: '',
  });

  // Responsável pela Inscrição
  const [responsavelInscricao, setResponsavelInscricao] = useState({
    nome: '',
    telefone_comercial: '',
    telefone_celular: '',
    email: '',
  });

  // Responsável pelo Pagamento
  const [responsavelPagamento, setResponsavelPagamento] = useState({
    nome: '',
    telefone_comercial: '',
    telefone_celular: '',
    email: '',
  });

  const [participantes, setParticipantes] = useState<Participante[]>([{ ...emptyParticipante }]);

  const addParticipante = () => {
    if (participantes.length < 5) {
      setParticipantes([...participantes, { ...emptyParticipante }]);
    }
  };

  const removeParticipante = (index: number) => {
    if (participantes.length > 1) {
      setParticipantes(participantes.filter((_, i) => i !== index));
    }
  };

  const updateParticipante = (index: number, field: keyof Participante, value: string) => {
    const updated = [...participantes];
    updated[index][field] = value;
    setParticipantes(updated);
  };

  const buildWhatsAppMessage = () => {
    let message = `*🎓 NOVA INSCRIÇÃO!*\n\n`;
    message += `*📚 Curso:* ${course.title}\n`;
    message += `*📅 Data:* ${course.course_date || 'A informar'}\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*📋 DADOS DA INSCRIÇÃO*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `*Tipo:* ${type === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}\n\n`;
    
    message += `*Razão Social/Nome:* ${dadosGerais.razao_social}\n`;
    message += `*Endereço:* ${dadosGerais.endereco}\n`;
    message += `*Bairro:* ${dadosGerais.bairro}\n`;
    message += `*CEP:* ${dadosGerais.cep}\n`;
    message += `*Cidade:* ${dadosGerais.cidade}\n`;
    message += `*UF:* ${dadosGerais.uf}\n`;
    message += `*CNPJ/CPF:* ${dadosGerais.cnpj_cpf}\n`;
    message += `*Tel. Comercial:* ${dadosGerais.telefone_comercial}\n`;
    message += `*Tel. Celular:* ${dadosGerais.telefone_celular}\n`;
    message += `*E-mail:* ${dadosGerais.email}\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*👤 RESPONSÁVEL PELA INSCRIÇÃO*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `*Nome:* ${responsavelInscricao.nome}\n`;
    message += `*Tel. Comercial:* ${responsavelInscricao.telefone_comercial}\n`;
    message += `*Tel. Celular:* ${responsavelInscricao.telefone_celular}\n`;
    message += `*E-mail:* ${responsavelInscricao.email}\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*💳 RESPONSÁVEL PELO PAGAMENTO*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `*Nome:* ${responsavelPagamento.nome}\n`;
    message += `*Tel. Comercial:* ${responsavelPagamento.telefone_comercial}\n`;
    message += `*Tel. Celular:* ${responsavelPagamento.telefone_celular}\n`;
    message += `*E-mail:* ${responsavelPagamento.email}\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*👥 DADOS DOS PARTICIPANTES*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    participantes.forEach((p, index) => {
      if (p.nome) {
        message += `*Participante ${index + 1}:*\n`;
        message += `  *Nome:* ${p.nome}\n`;
        message += `  *Tel. Comercial:* ${p.telefone_comercial}\n`;
        message += `  *Tel. Celular:* ${p.telefone_celular}\n`;
        message += `  *E-mail:* ${p.email}\n\n`;
      }
    });
    
    return encodeURIComponent(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Criar inscrição para cada participante
      for (const participante of participantes) {
        if (!participante.nome || !participante.email || !participante.telefone_celular) {
          continue;
        }

        await createEnrollment({
          course_id: course.id,
          course_name: course.title,
          enrollment_type: type,
          nome_completo: participante.nome,
          cpf: dadosGerais.cnpj_cpf,
          telefone_celular: participante.telefone_celular,
          email: participante.email,
          rg: null,
          data_nascimento: null,
          cargo: null,
          matricula: null,
          setor: null,
          nome_empresa: dadosGerais.razao_social,
          cnpj: dadosGerais.cnpj_cpf,
          telefone_fixo: dadosGerais.telefone_comercial,
          cep: dadosGerais.cep,
          endereco: dadosGerais.endereco,
          numero: null,
          complemento: null,
          bairro: dadosGerais.bairro,
          cidade: dadosGerais.cidade,
          uf: dadosGerais.uf,
          responsavel_nome: responsavelInscricao.nome,
          responsavel_cargo: null,
          responsavel_telefone: responsavelInscricao.telefone_celular,
          responsavel_email: responsavelInscricao.email,
        });
      }

      // Enviar email
      try {
        const participantesInfo = participantes
          .filter(p => p.nome && p.email)
          .map(p => `${p.nome} (${p.email}, ${p.telefone_celular})`)
          .join(' | ');

        await sendEnrollmentEmail({
          courseName: course.title,
          courseDate: course.course_date || 'A informar',
          enrollmentType: type,
          nomeCompleto: participantesInfo,
          cpf: dadosGerais.cnpj_cpf,
          telefoneCelular: dadosGerais.telefone_celular,
          email: dadosGerais.email,
          rg: null,
          dataNascimento: null,
          cargo: null,
          matricula: null,
          setor: null,
          nomeEmpresa: dadosGerais.razao_social,
          cnpj: dadosGerais.cnpj_cpf,
          telefoneFixo: dadosGerais.telefone_comercial,
          cep: dadosGerais.cep,
          endereco: dadosGerais.endereco,
          numero: null,
          complemento: null,
          bairro: dadosGerais.bairro,
          cidade: dadosGerais.cidade,
          uf: dadosGerais.uf,
          responsavelNome: `Inscrição: ${responsavelInscricao.nome} | Pagamento: ${responsavelPagamento.nome}`,
          responsavelCargo: null,
          responsavelTelefone: `Inscrição: ${responsavelInscricao.telefone_celular} | Pagamento: ${responsavelPagamento.telefone_celular}`,
          responsavelEmail: `Inscrição: ${responsavelInscricao.email} | Pagamento: ${responsavelPagamento.email}`,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      // Abrir WhatsApp com mensagem formatada
      const whatsappMessage = buildWhatsAppMessage();
      window.open(`https://api.whatsapp.com/send?phone=5585989330489&text=${whatsappMessage}`, '_blank');

      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Você será redirecionado para o WhatsApp para confirmar.",
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Erro ao realizar inscrição",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDadosGerais({
      razao_social: '',
      endereco: '',
      bairro: '',
      cep: '',
      cidade: '',
      uf: '',
      cnpj_cpf: '',
      telefone_comercial: '',
      telefone_celular: '',
      email: '',
    });
    setResponsavelInscricao({ nome: '', telefone_comercial: '', telefone_celular: '', email: '' });
    setResponsavelPagamento({ nome: '', telefone_comercial: '', telefone_celular: '', email: '' });
    setParticipantes([{ ...emptyParticipante }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-foreground/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden"
          >
            <div className="gradient-primary p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary-foreground">Ficha de Inscrição</h2>
                  <p className="text-primary-foreground/80 mt-1 text-sm line-clamp-1">{course.title}</p>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
              {/* Observação */}
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Obs:</strong> Por favor, preencha todos os campos da ficha de inscrição. Após o envio, você será redirecionado para o WhatsApp para confirmar sua inscrição.
                </p>
              </div>

              {/* Type Selection */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setType('pessoa_fisica')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    type === 'pessoa_fisica'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base">Pessoa Física</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('pessoa_juridica')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    type === 'pessoa_juridica'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base">Pessoa Jurídica</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados Gerais */}
                <div className="space-y-4">
                  <h3 className="font-bold text-foreground border-b-2 border-primary pb-2 text-lg">
                    {type === 'pessoa_fisica' ? 'Dados Pessoais' : 'Dados da Empresa/Órgão'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="razao_social" className="font-semibold">Razão Social / Nome *</Label>
                      <Input
                        id="razao_social"
                        value={dadosGerais.razao_social}
                        onChange={(e) => setDadosGerais({ ...dadosGerais, razao_social: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="endereco" className="font-semibold">Endereço *</Label>
                      <Input
                        id="endereco"
                        value={dadosGerais.endereco}
                        onChange={(e) => setDadosGerais({ ...dadosGerais, endereco: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bairro" className="font-semibold">Bairro *</Label>
                      <Input
                        id="bairro"
                        value={dadosGerais.bairro}
                        onChange={(e) => setDadosGerais({ ...dadosGerais, bairro: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cep" className="font-semibold">CEP *</Label>
                      <Input
                        id="cep"
                        value={dadosGerais.cep}
                        onChange={(e) => setDadosGerais({ ...dadosGerais, cep: e.target.value })}
                        placeholder="00000-000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cidade" className="font-semibold">Cidade *</Label>
                      <Input
                        id="cidade"
                        value={dadosGerais.cidade}
                        onChange={(e) => setDadosGerais({ ...dadosGerais, cidade: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="uf" className="font-semibold">UF *</Label>
                      <Input
                        id="uf"
                        value={dadosGerais.uf}
                        onChange={(e) => setDadosGerais({ ...dadosGerais, uf: e.target.value.toUpperCase() })}
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cnpj_cpf" className="font-semibold">{type === 'pessoa_fisica' ? 'CPF' : 'CNPJ'} *</Label>
                      <Input
                        id="cnpj_cpf"
                        value={dadosGerais.cnpj_cpf}
                        onChange={(e) => setDadosGerais({ ...dadosGerais, cnpj_cpf: e.target.value })}
                        placeholder={type === 'pessoa_fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone_comercial" className="font-semibold">Telefone Comercial</Label>
                      <Input
                        id="telefone_comercial"
                        value={dadosGerais.telefone_comercial}
                        onChange={(e) => setDadosGerais({ ...dadosGerais, telefone_comercial: e.target.value })}
                        placeholder="(00) 0000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone_celular" className="font-semibold">Telefone Celular *</Label>
                      <Input
                        id="telefone_celular"
                        value={dadosGerais.telefone_celular}
                        onChange={(e) => setDadosGerais({ ...dadosGerais, telefone_celular: e.target.value })}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-semibold">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={dadosGerais.email}
                        onChange={(e) => setDadosGerais({ ...dadosGerais, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Responsável pela Inscrição */}
                <div className="space-y-4">
                  <h3 className="font-bold text-foreground border-b-2 border-primary pb-2 text-lg">
                    Responsável pela Inscrição
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="resp_insc_nome" className="font-semibold">Nome *</Label>
                      <Input
                        id="resp_insc_nome"
                        value={responsavelInscricao.nome}
                        onChange={(e) => setResponsavelInscricao({ ...responsavelInscricao, nome: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="resp_insc_tel_com" className="font-semibold">Telefone Comercial</Label>
                      <Input
                        id="resp_insc_tel_com"
                        value={responsavelInscricao.telefone_comercial}
                        onChange={(e) => setResponsavelInscricao({ ...responsavelInscricao, telefone_comercial: e.target.value })}
                        placeholder="(00) 0000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="resp_insc_tel_cel" className="font-semibold">Telefone Celular *</Label>
                      <Input
                        id="resp_insc_tel_cel"
                        value={responsavelInscricao.telefone_celular}
                        onChange={(e) => setResponsavelInscricao({ ...responsavelInscricao, telefone_celular: e.target.value })}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="resp_insc_email" className="font-semibold">E-mail *</Label>
                      <Input
                        id="resp_insc_email"
                        type="email"
                        value={responsavelInscricao.email}
                        onChange={(e) => setResponsavelInscricao({ ...responsavelInscricao, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Responsável pelo Pagamento */}
                <div className="space-y-4">
                  <h3 className="font-bold text-foreground border-b-2 border-primary pb-2 text-lg">
                    Responsável pelo Pagamento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="resp_pag_nome" className="font-semibold">Nome *</Label>
                      <Input
                        id="resp_pag_nome"
                        value={responsavelPagamento.nome}
                        onChange={(e) => setResponsavelPagamento({ ...responsavelPagamento, nome: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="resp_pag_tel_com" className="font-semibold">Telefone Comercial</Label>
                      <Input
                        id="resp_pag_tel_com"
                        value={responsavelPagamento.telefone_comercial}
                        onChange={(e) => setResponsavelPagamento({ ...responsavelPagamento, telefone_comercial: e.target.value })}
                        placeholder="(00) 0000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="resp_pag_tel_cel" className="font-semibold">Telefone Celular *</Label>
                      <Input
                        id="resp_pag_tel_cel"
                        value={responsavelPagamento.telefone_celular}
                        onChange={(e) => setResponsavelPagamento({ ...responsavelPagamento, telefone_celular: e.target.value })}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="resp_pag_email" className="font-semibold">E-mail *</Label>
                      <Input
                        id="resp_pag_email"
                        type="email"
                        value={responsavelPagamento.email}
                        onChange={(e) => setResponsavelPagamento({ ...responsavelPagamento, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Participantes */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                    <h3 className="font-bold text-foreground text-lg">
                      Dados dos Participantes ({participantes.length}/5)
                    </h3>
                    {participantes.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addParticipante}
                        className="gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </Button>
                    )}
                  </div>
                  
                  {participantes.map((participante, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          Participante {index + 1}
                        </span>
                        {participantes.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeParticipante(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label className="font-semibold">Nome *</Label>
                          <Input
                            value={participante.nome}
                            onChange={(e) => updateParticipante(index, 'nome', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label className="font-semibold">Telefone Comercial</Label>
                          <Input
                            value={participante.telefone_comercial}
                            onChange={(e) => updateParticipante(index, 'telefone_comercial', e.target.value)}
                            placeholder="(00) 0000-0000"
                          />
                        </div>
                        <div>
                          <Label className="font-semibold">Telefone Celular *</Label>
                          <Input
                            value={participante.telefone_celular}
                            onChange={(e) => updateParticipante(index, 'telefone_celular', e.target.value)}
                            placeholder="(00) 00000-0000"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="font-semibold">E-mail *</Label>
                          <Input
                            type="email"
                            value={participante.email}
                            onChange={(e) => updateParticipante(index, 'email', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Observações finais */}
                <div className="p-4 bg-muted/50 border border-border rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Atenciosamente,</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Nacional Treinamentos Eireli-Me<br />
                    CNPJ: 09.380.282/0001-74<br />
                    www.nacionaltreinamentos.com.br<br />
                    (85) 98933-0489 – WhatsApp
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" variant="hero" className="flex-1 gap-2" disabled={isSubmitting}>
                    <MessageCircle className="w-5 h-5" />
                    {isSubmitting ? 'Enviando...' : 'Enviar Inscrição via WhatsApp'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
