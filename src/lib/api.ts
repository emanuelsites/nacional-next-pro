import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  title: string;
  short_description: string | null;
  full_description: string | null;
  content: string | null;
  category: string;
  location: string | null;
  course_date: string | null;
  duration: string | null;
  modality: string | null;
  instructor: string | null;
  certificate: boolean | null;
  prerequisites: string | null;
  image_url: string | null;
  featured: boolean | null;
  active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Enrollment {
  id: string;
  course_id: string | null;
  course_name: string;
  enrollment_type: string;
  nome_completo: string | null;
  cpf: string | null;
  rg: string | null;
  data_nascimento: string | null;
  cargo: string | null;
  matricula: string | null;
  setor: string | null;
  nome_empresa: string | null;
  cnpj: string | null;
  telefone_fixo: string | null;
  telefone_celular: string;
  email: string;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  responsavel_nome: string | null;
  responsavel_cargo: string | null;
  responsavel_telefone: string | null;
  responsavel_email: string | null;
  status: string | null;
  created_at: string | null;
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

export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function fetchActiveCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

export async function createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCourse(id: string, course: Partial<Course>): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .update(course)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function fetchEnrollments(): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createEnrollment(enrollment: Omit<Enrollment, 'id' | 'created_at' | 'status'>): Promise<Enrollment> {
  const { data, error } = await supabase
    .from('enrollments')
    .insert(enrollment)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteEnrollment(id: string): Promise<void> {
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('has_role', { _user_id: userId, _role: 'admin' });
  
  if (error) return false;
  return data === true;
}

export async function setUserAsAdmin(userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_roles')
    .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });
  
  if (error) throw error;
}

interface Participante {
  nome: string;
  telefone_comercial: string;
  telefone_celular: string;
  email: string;
}

export async function sendEnrollmentEmail(data: {
  courseName: string;
  courseDate: string;
  enrollmentType: string;
  dadosGerais: {
    razao_social: string;
    endereco: string;
    bairro: string;
    cep: string;
    cidade: string;
    uf: string;
    cnpj_cpf: string;
    telefone_comercial: string;
    telefone_celular: string;
    email: string;
  };
  responsavelInscricao: {
    nome: string;
    telefone_comercial: string;
    telefone_celular: string;
    email: string;
  };
  responsavelPagamento: {
    nome: string;
    telefone_comercial: string;
    telefone_celular: string;
    email: string;
  };
  participantes: Participante[];
}): Promise<void> {
  const { error } = await supabase.functions.invoke('send-enrollment-email', {
    body: data,
  });
  
  if (error) {
    console.error('Error sending enrollment email:', error);
    throw error;
  }
}
