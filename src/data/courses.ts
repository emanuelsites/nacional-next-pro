export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  content: string[];
  category: string;
  location: string;
  date: string;
  duration: string;
  modality: "Presencial" | "Online" | "Híbrido";
  instructor: string;
  certificate: boolean;
  prerequisites: string;
  image: string;
  featured: boolean;
  active: boolean;
}

export const categories = [
  "Todos",
  "Convênios / SICONV",
  "Legislação de Pessoal",
  "Licitações / Contratos",
  "Logística / Materiais",
  "Orçamento / Contabilidade",
  "Recursos Humanos",
];

export const courses: Course[] = [
  {
    id: "1",
    title: "Licitações e Contratos com Ênfase na Formação de Agentes de Contratações (Pregoeiros)",
    shortDescription: "Com a Aplicação da Inteligência Artificial (IA) nas Contratações Públicas, para Aquisições de Materiais e Serviços na Administração Pública.",
    fullDescription: "Este curso visa capacitar profissionais da Administração Pública para atuarem como Agentes de Contratações (Pregoeiros), com foco na aplicação da Lei nº 14.133/2021 e na utilização da Inteligência Artificial como ferramenta de apoio nas contratações públicas. O curso aborda desde os conceitos fundamentais até as práticas avançadas de gestão de licitações e contratos.",
    content: [
      "Introdução à Nova Lei de Licitações (Lei nº 14.133/2021)",
      "O papel do Agente de Contratações e do Pregoeiro",
      "Modalidades de Licitação e suas aplicações",
      "Elaboração de Editais e Termos de Referência",
      "Sistema de Registro de Preços (SRP)",
      "Aplicação da Inteligência Artificial nas Contratações",
      "Gestão e Fiscalização de Contratos",
      "Sanções Administrativas e Recursos",
      "Casos práticos e simulações"
    ],
    category: "Licitações / Contratos",
    location: "Belém/PA",
    date: "27 a 29/01/2026",
    duration: "24 horas",
    modality: "Presencial",
    instructor: "Prof. Nazareno Nesi, Msc",
    certificate: true,
    prerequisites: "Nível superior completo ou em andamento",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    featured: true,
    active: true
  },
  {
    id: "2",
    title: "Gestão Patrimonial: Instrumentos Para a Gerência de Almoxarifado e Patrimônio",
    shortDescription: "Desfazimento de Bens Móveis - Atualizado pelo MCASP e pela legislação em vigor (Dec 9373/18).",
    fullDescription: "Curso completo sobre gestão patrimonial na Administração Pública, abordando os instrumentos e técnicas para gerência eficiente de almoxarifado e patrimônio, incluindo procedimentos de desfazimento de bens móveis conforme a legislação vigente.",
    content: [
      "Conceitos fundamentais de gestão patrimonial",
      "Classificação e codificação de materiais",
      "Controle de estoque e almoxarifado",
      "Inventário e avaliação patrimonial",
      "Procedimentos de desfazimento de bens",
      "Decreto nº 9.373/2018 e suas aplicações",
      "MCASP e contabilização patrimonial",
      "Sistemas informatizados de gestão",
      "Casos práticos e exercícios"
    ],
    category: "Logística / Materiais",
    location: "Online",
    date: "3 a 6/3/2026",
    duration: "16 horas",
    modality: "Online",
    instructor: "Paulo Silvio Silva de Faria",
    certificate: true,
    prerequisites: "Atuação na área de patrimônio ou almoxarifado",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    featured: true,
    active: true
  },
  {
    id: "3",
    title: "Inteligência Artificial Para Gestão Pública Municipal",
    shortDescription: "Aplicação de ferramentas de IA para modernização e eficiência na gestão pública municipal.",
    fullDescription: "Curso inovador que apresenta as principais ferramentas e aplicações de Inteligência Artificial para modernização da gestão pública municipal, visando maior eficiência, transparência e qualidade nos serviços públicos.",
    content: [
      "Introdução à Inteligência Artificial",
      "Ferramentas de IA disponíveis para o setor público",
      "Automatização de processos administrativos",
      "IA para atendimento ao cidadão",
      "Análise de dados e tomada de decisão",
      "Transparência e accountability com IA",
      "Aspectos éticos e legais",
      "Implementação de projetos de IA",
      "Estudos de caso e boas práticas"
    ],
    category: "Recursos Humanos",
    location: "Online",
    date: "A informar",
    duration: "20 horas",
    modality: "Online",
    instructor: "Prof. Nazareno Nesi, Msc",
    certificate: true,
    prerequisites: "Gestores e servidores públicos municipais",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    featured: true,
    active: true
  },
  {
    id: "4",
    title: "Estudo Técnico Preliminar, Elaboração de Editais e Termo de Referência",
    shortDescription: "Projeto Básico e Aplicação da IA nas Contratações Públicas para Aquisições de Materiais e Serviços.",
    fullDescription: "Capacitação completa sobre a elaboração de documentos essenciais para o processo licitatório, incluindo Estudo Técnico Preliminar, Editais, Termos de Referência e Projetos Básicos, com aplicação de Inteligência Artificial.",
    content: [
      "Estudo Técnico Preliminar (ETP)",
      "Elementos obrigatórios do ETP",
      "Elaboração de Termos de Referência",
      "Projeto Básico e Projeto Executivo",
      "Pesquisa de preços e orçamento estimado",
      "Especificações técnicas e critérios de aceitação",
      "Uso de IA na elaboração de documentos",
      "Análise de riscos nas contratações",
      "Exercícios práticos"
    ],
    category: "Licitações / Contratos",
    location: "Santarém/PA",
    date: "09 a 11/12/2025",
    duration: "24 horas",
    modality: "Presencial",
    instructor: "Prof. Nazareno Nesi, Msc",
    certificate: true,
    prerequisites: "Servidores que atuam com contratações públicas",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    featured: false,
    active: true
  },
  {
    id: "5",
    title: "Folha de Pagamento e e-Social na Administração Pública",
    shortDescription: "Atualização sobre cálculos de folha de pagamento e obrigações do e-Social para órgãos públicos.",
    fullDescription: "Curso focado nas particularidades da folha de pagamento no setor público, incluindo cálculos, benefícios, descontos e a implementação completa do e-Social para órgãos da Administração Pública.",
    content: [
      "Estrutura da folha de pagamento pública",
      "Verbas e rubricas específicas",
      "Cálculos de vencimentos e benefícios",
      "Descontos legais e facultativos",
      "Encargos sociais e previdenciários",
      "e-Social: conceitos e obrigações",
      "Eventos do e-Social para o setor público",
      "Prazos e penalidades",
      "Sistemas e ferramentas de gestão"
    ],
    category: "Legislação de Pessoal",
    location: "Fortaleza/CE",
    date: "15 a 17/02/2026",
    duration: "20 horas",
    modality: "Presencial",
    instructor: "Especialista em RH Público",
    certificate: true,
    prerequisites: "Profissionais de RH do setor público",
    image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80",
    featured: false,
    active: true
  },
  {
    id: "6",
    title: "Controle Interno e Auditoria Governamental",
    shortDescription: "Técnicas e procedimentos de controle interno e auditoria aplicados ao setor público.",
    fullDescription: "Formação completa em controle interno e auditoria governamental, abordando técnicas, procedimentos e normas aplicáveis ao setor público, com foco na prevenção de irregularidades e melhoria da gestão.",
    content: [
      "Sistema de Controle Interno",
      "Princípios e objetivos do controle interno",
      "Ambiente de controle e avaliação de riscos",
      "Técnicas de auditoria governamental",
      "Planejamento e execução de auditorias",
      "Amostragem em auditoria",
      "Elaboração de relatórios",
      "Acompanhamento de recomendações",
      "Normas de auditoria do setor público"
    ],
    category: "Orçamento / Contabilidade",
    location: "Online",
    date: "10 a 14/03/2026",
    duration: "30 horas",
    modality: "Online",
    instructor: "Auditor Governamental",
    certificate: true,
    prerequisites: "Servidores de controle interno e auditoria",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    featured: false,
    active: true
  }
];
