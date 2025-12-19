import { useState } from 'react';
import { X, User, Building2, Plus, Trash2 } from 'lucide-react';
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
  email: string;
  telefone: string;
  cpf: string;
}

const emptyParticipante: Participante = { nome: '', email: '', telefone: '', cpf: '' };

export default function EnrollmentModal({ isOpen, onClose, course }: EnrollmentModalProps) {
  const [type, setType] = useState<'pessoa_fisica' | 'pessoa_juridica'>('pessoa_fisica');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Pessoa Física - campos simplificados
  const [pessoaFisica, setPessoaFisica] = useState({
    nome_completo: '',
    cpf: '',
    telefone_celular: '',
    email: '',
  });

  // Pessoa Jurídica - campos completos
  const [empresa, setEmpresa] = useState({
    nome_empresa: '',
    cnpj: '',
    endereco: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    telefone: '',
  });

  const [responsavelPagamento, setResponsavelPagamento] = useState({
    nome: '',
    cargo: '',
    telefone: '',
    email: '',
  });

  const [responsavelInscricao, setResponsavelInscricao] = useState({
    nome: '',
    cargo: '',
    telefone: '',
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

  const handleSubmitPF = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createEnrollment({
        course_id: course.id,
        course_name: course.title,
        enrollment_type: 'pessoa_fisica',
        nome_completo: pessoaFisica.nome_completo,
        cpf: pessoaFisica.cpf,
        telefone_celular: pessoaFisica.telefone_celular,
        email: pessoaFisica.email,
        rg: null,
        data_nascimento: null,
        cargo: null,
        matricula: null,
        setor: null,
        nome_empresa: null,
        cnpj: null,
        telefone_fixo: null,
        cep: null,
        endereco: null,
        numero: null,
        complemento: null,
        bairro: null,
        cidade: null,
        uf: null,
        responsavel_nome: null,
        responsavel_cargo: null,
        responsavel_telefone: null,
        responsavel_email: null,
      });

      try {
        await sendEnrollmentEmail({
          courseName: course.title,
          courseDate: course.course_date || 'A informar',
          enrollmentType: 'pessoa_fisica',
          nomeCompleto: pessoaFisica.nome_completo,
          cpf: pessoaFisica.cpf,
          telefoneCelular: pessoaFisica.telefone_celular,
          email: pessoaFisica.email,
          rg: null,
          dataNascimento: null,
          cargo: null,
          matricula: null,
          setor: null,
          nomeEmpresa: null,
          cnpj: null,
          telefoneFixo: null,
          cep: null,
          endereco: null,
          numero: null,
          complemento: null,
          bairro: null,
          cidade: null,
          uf: null,
          responsavelNome: null,
          responsavelCargo: null,
          responsavelTelefone: null,
          responsavelEmail: null,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Em breve entraremos em contato com mais informações.",
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

  const handleSubmitPJ = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Criar uma inscrição para cada participante
      for (const participante of participantes) {
        if (!participante.nome || !participante.email || !participante.telefone || !participante.cpf) {
          continue;
        }

        await createEnrollment({
          course_id: course.id,
          course_name: course.title,
          enrollment_type: 'pessoa_juridica',
          nome_completo: participante.nome,
          cpf: participante.cpf,
          telefone_celular: participante.telefone,
          email: participante.email,
          rg: null,
          data_nascimento: null,
          cargo: null,
          matricula: null,
          setor: null,
          nome_empresa: empresa.nome_empresa,
          cnpj: empresa.cnpj,
          telefone_fixo: empresa.telefone,
          cep: empresa.cep,
          endereco: empresa.endereco,
          numero: null,
          complemento: null,
          bairro: empresa.bairro,
          cidade: empresa.cidade,
          uf: empresa.uf,
          responsavel_nome: responsavelInscricao.nome,
          responsavel_cargo: responsavelInscricao.cargo,
          responsavel_telefone: responsavelInscricao.telefone,
          responsavel_email: responsavelInscricao.email,
        });
      }

      // Enviar email com todos os participantes
      try {
        const participantesInfo = participantes
          .filter(p => p.nome && p.email)
          .map(p => `${p.nome} (${p.email}, ${p.telefone}, CPF: ${p.cpf})`)
          .join(' | ');

        await sendEnrollmentEmail({
          courseName: course.title,
          courseDate: course.course_date || 'A informar',
          enrollmentType: 'pessoa_juridica',
          nomeCompleto: participantesInfo,
          cpf: null,
          telefoneCelular: empresa.telefone || responsavelInscricao.telefone,
          email: responsavelInscricao.email || participantes[0]?.email || '',
          rg: null,
          dataNascimento: null,
          cargo: null,
          matricula: null,
          setor: null,
          nomeEmpresa: empresa.nome_empresa,
          cnpj: empresa.cnpj,
          telefoneFixo: empresa.telefone,
          cep: empresa.cep,
          endereco: empresa.endereco,
          numero: null,
          complemento: null,
          bairro: empresa.bairro,
          cidade: empresa.cidade,
          uf: empresa.uf,
          responsavelNome: `Inscrição: ${responsavelInscricao.nome} | Pagamento: ${responsavelPagamento.nome}`,
          responsavelCargo: `Inscrição: ${responsavelInscricao.cargo} | Pagamento: ${responsavelPagamento.cargo}`,
          responsavelTelefone: `Inscrição: ${responsavelInscricao.telefone} | Pagamento: ${responsavelPagamento.telefone}`,
          responsavelEmail: `Inscrição: ${responsavelInscricao.email} | Pagamento: ${responsavelPagamento.email}`,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      toast({
        title: "Inscrições realizadas com sucesso!",
        description: `${participantes.filter(p => p.nome).length} participante(s) inscrito(s).`,
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
    setPessoaFisica({ nome_completo: '', cpf: '', telefone_celular: '', email: '' });
    setEmpresa({ nome_empresa: '', cnpj: '', endereco: '', bairro: '', cidade: '', uf: '', cep: '', telefone: '' });
    setResponsavelPagamento({ nome: '', cargo: '', telefone: '', email: '' });
    setResponsavelInscricao({ nome: '', cargo: '', telefone: '', email: '' });
    setParticipantes([{ ...emptyParticipante }]);
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
            className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
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

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Type Selection */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setType('pessoa_fisica')}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    type === 'pessoa_fisica'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Pessoa Física</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('pessoa_juridica')}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    type === 'pessoa_juridica'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Pessoa Jurídica</span>
                </button>
              </div>

              {type === 'pessoa_fisica' ? (
                <form onSubmit={handleSubmitPF} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground border-b border-border pb-2">
                      Dados do Participante
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="pf_nome">Nome Completo *</Label>
                        <Input
                          id="pf_nome"
                          value={pessoaFisica.nome_completo}
                          onChange={(e) => setPessoaFisica({ ...pessoaFisica, nome_completo: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pf_cpf">CPF *</Label>
                        <Input
                          id="pf_cpf"
                          value={pessoaFisica.cpf}
                          onChange={(e) => setPessoaFisica({ ...pessoaFisica, cpf: e.target.value })}
                          placeholder="000.000.000-00"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pf_telefone">Telefone/WhatsApp *</Label>
                        <Input
                          id="pf_telefone"
                          value={pessoaFisica.telefone_celular}
                          onChange={(e) => setPessoaFisica({ ...pessoaFisica, telefone_celular: e.target.value })}
                          placeholder="(00) 00000-0000"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="pf_email">E-mail *</Label>
                        <Input
                          id="pf_email"
                          type="email"
                          value={pessoaFisica.email}
                          onChange={(e) => setPessoaFisica({ ...pessoaFisica, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando...' : 'Enviar Inscrição'}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmitPJ} className="space-y-6">
                  {/* Dados da Empresa */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground border-b border-border pb-2">
                      Dados da Empresa/Órgão
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="empresa_nome">Nome da Empresa/Órgão *</Label>
                        <Input
                          id="empresa_nome"
                          value={empresa.nome_empresa}
                          onChange={(e) => setEmpresa({ ...empresa, nome_empresa: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa_cnpj">CNPJ *</Label>
                        <Input
                          id="empresa_cnpj"
                          value={empresa.cnpj}
                          onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })}
                          placeholder="00.000.000/0000-00"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa_telefone">Telefone</Label>
                        <Input
                          id="empresa_telefone"
                          value={empresa.telefone}
                          onChange={(e) => setEmpresa({ ...empresa, telefone: e.target.value })}
                          placeholder="(00) 0000-0000"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="empresa_endereco">Endereço</Label>
                        <Input
                          id="empresa_endereco"
                          value={empresa.endereco}
                          onChange={(e) => setEmpresa({ ...empresa, endereco: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa_bairro">Bairro</Label>
                        <Input
                          id="empresa_bairro"
                          value={empresa.bairro}
                          onChange={(e) => setEmpresa({ ...empresa, bairro: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa_cidade">Cidade</Label>
                        <Input
                          id="empresa_cidade"
                          value={empresa.cidade}
                          onChange={(e) => setEmpresa({ ...empresa, cidade: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa_uf">UF</Label>
                        <Input
                          id="empresa_uf"
                          value={empresa.uf}
                          onChange={(e) => setEmpresa({ ...empresa, uf: e.target.value })}
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa_cep">CEP</Label>
                        <Input
                          id="empresa_cep"
                          value={empresa.cep}
                          onChange={(e) => setEmpresa({ ...empresa, cep: e.target.value })}
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Responsável pelo Pagamento */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground border-b border-border pb-2">
                      Responsável pelo Pagamento
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pag_nome">Nome *</Label>
                        <Input
                          id="pag_nome"
                          value={responsavelPagamento.nome}
                          onChange={(e) => setResponsavelPagamento({ ...responsavelPagamento, nome: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pag_cargo">Cargo</Label>
                        <Input
                          id="pag_cargo"
                          value={responsavelPagamento.cargo}
                          onChange={(e) => setResponsavelPagamento({ ...responsavelPagamento, cargo: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pag_telefone">Telefone *</Label>
                        <Input
                          id="pag_telefone"
                          value={responsavelPagamento.telefone}
                          onChange={(e) => setResponsavelPagamento({ ...responsavelPagamento, telefone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pag_email">E-mail *</Label>
                        <Input
                          id="pag_email"
                          type="email"
                          value={responsavelPagamento.email}
                          onChange={(e) => setResponsavelPagamento({ ...responsavelPagamento, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Responsável pela Inscrição */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground border-b border-border pb-2">
                      Responsável pela Inscrição
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="insc_nome">Nome *</Label>
                        <Input
                          id="insc_nome"
                          value={responsavelInscricao.nome}
                          onChange={(e) => setResponsavelInscricao({ ...responsavelInscricao, nome: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="insc_cargo">Cargo</Label>
                        <Input
                          id="insc_cargo"
                          value={responsavelInscricao.cargo}
                          onChange={(e) => setResponsavelInscricao({ ...responsavelInscricao, cargo: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insc_telefone">Telefone *</Label>
                        <Input
                          id="insc_telefone"
                          value={responsavelInscricao.telefone}
                          onChange={(e) => setResponsavelInscricao({ ...responsavelInscricao, telefone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="insc_email">E-mail *</Label>
                        <Input
                          id="insc_email"
                          type="email"
                          value={responsavelInscricao.email}
                          onChange={(e) => setResponsavelInscricao({ ...responsavelInscricao, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Participantes */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <h3 className="font-semibold text-foreground">
                        Participantes ({participantes.length}/5)
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
                      <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-muted-foreground">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Nome Completo *</Label>
                            <Input
                              value={participante.nome}
                              onChange={(e) => updateParticipante(index, 'nome', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label>CPF *</Label>
                            <Input
                              value={participante.cpf}
                              onChange={(e) => updateParticipante(index, 'cpf', e.target.value)}
                              placeholder="000.000.000-00"
                              required
                            />
                          </div>
                          <div>
                            <Label>Telefone *</Label>
                            <Input
                              value={participante.telefone}
                              onChange={(e) => updateParticipante(index, 'telefone', e.target.value)}
                              placeholder="(00) 00000-0000"
                              required
                            />
                          </div>
                          <div>
                            <Label>E-mail *</Label>
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

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando...' : 'Enviar Inscrição'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
