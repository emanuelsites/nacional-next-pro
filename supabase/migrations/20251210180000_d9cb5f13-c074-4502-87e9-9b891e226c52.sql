-- Add additional fields to enrollments table for complete enrollment form
ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS rg text,
ADD COLUMN IF NOT EXISTS data_nascimento text,
ADD COLUMN IF NOT EXISTS cargo text,
ADD COLUMN IF NOT EXISTS matricula text,
ADD COLUMN IF NOT EXISTS setor text,
ADD COLUMN IF NOT EXISTS numero text,
ADD COLUMN IF NOT EXISTS complemento text,
ADD COLUMN IF NOT EXISTS responsavel_nome text,
ADD COLUMN IF NOT EXISTS responsavel_cargo text,
ADD COLUMN IF NOT EXISTS responsavel_telefone text,
ADD COLUMN IF NOT EXISTS responsavel_email text;