-- Adicionar campo slug para URLs amigáveis
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Criar função para gerar slug a partir do título
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Remove acentos e caracteres especiais, converte para minúsculas
  base_slug := lower(title);
  base_slug := translate(base_slug, 'áàâãäéèêëíìîïóòôõöúùûüçñ', 'aaaaaeeeeiiiioooooouuuucn');
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  -- Limita o tamanho do slug
  base_slug := substring(base_slug from 1 for 80);
  
  final_slug := base_slug;
  
  -- Verifica se já existe e adiciona sufixo se necessário
  WHILE EXISTS (SELECT 1 FROM public.courses WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Criar trigger para gerar slug automaticamente ao inserir/atualizar
CREATE OR REPLACE FUNCTION public.set_course_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Gera slug apenas se não foi fornecido ou se o título mudou
  IF NEW.slug IS NULL OR NEW.slug = '' OR (TG_OP = 'UPDATE' AND OLD.title != NEW.title AND NEW.slug = OLD.slug) THEN
    NEW.slug := public.generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_set_course_slug ON public.courses;
CREATE TRIGGER trigger_set_course_slug
BEFORE INSERT OR UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.set_course_slug();

-- Atualizar cursos existentes com slugs
UPDATE public.courses SET slug = public.generate_slug(title) WHERE slug IS NULL;