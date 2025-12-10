-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  content TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'Licitações / Contratos',
  location TEXT DEFAULT 'Online',
  course_date TEXT DEFAULT 'A informar',
  duration TEXT DEFAULT '20 horas',
  modality TEXT DEFAULT 'Online' CHECK (modality IN ('Presencial', 'Online', 'Híbrido')),
  instructor TEXT,
  certificate BOOLEAN DEFAULT true,
  prerequisites TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Public can view active courses
CREATE POLICY "Anyone can view active courses" 
ON public.courses 
FOR SELECT 
USING (active = true);

-- Admins can manage all courses
CREATE POLICY "Admins can manage courses" 
ON public.courses 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  enrollment_type TEXT NOT NULL CHECK (enrollment_type IN ('pessoa_fisica', 'pessoa_juridica')),
  -- Pessoa Física
  nome_completo TEXT,
  cpf TEXT,
  -- Pessoa Jurídica
  nome_empresa TEXT,
  cnpj TEXT,
  -- Common fields
  telefone_fixo TEXT,
  telefone_celular TEXT NOT NULL,
  email TEXT NOT NULL,
  cep TEXT,
  endereco TEXT,
  bairro TEXT,
  cidade TEXT,
  uf TEXT,
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Anyone can insert enrollments (public form)
CREATE POLICY "Anyone can create enrollments" 
ON public.enrollments 
FOR INSERT 
WITH CHECK (true);

-- Admins can view and manage all enrollments
CREATE POLICY "Admins can view all enrollments" 
ON public.enrollments 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update enrollments" 
ON public.enrollments 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete enrollments" 
ON public.enrollments 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create banners table for carousel
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link TEXT,
  active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on banners
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Public can view active banners
CREATE POLICY "Anyone can view active banners" 
ON public.banners 
FOR SELECT 
USING (active = true);

-- Admins can manage banners
CREATE POLICY "Admins can manage banners" 
ON public.banners 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Function to automatically assign admin role to first user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Trigger to assign role on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for courses updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();