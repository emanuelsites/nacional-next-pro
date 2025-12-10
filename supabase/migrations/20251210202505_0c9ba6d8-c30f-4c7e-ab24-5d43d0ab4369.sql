-- Change content column from array to text to support rich text HTML
ALTER TABLE public.courses 
ALTER COLUMN content TYPE text 
USING array_to_string(content, E'\n');