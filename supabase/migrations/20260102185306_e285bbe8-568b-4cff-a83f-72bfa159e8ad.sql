-- Create table to store editable content for the visual editor
CREATE TABLE public.site_content (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content_key TEXT NOT NULL UNIQUE,
    content_value TEXT,
    content_type TEXT NOT NULL DEFAULT 'text', -- text, image, html
    page TEXT NOT NULL DEFAULT 'global',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read site content (public website)
CREATE POLICY "Anyone can read site content" 
ON public.site_content 
FOR SELECT 
USING (true);

-- Only admins can insert content
CREATE POLICY "Admins can insert site content" 
ON public.site_content 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update content
CREATE POLICY "Admins can update site content" 
ON public.site_content 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete content
CREATE POLICY "Admins can delete site content" 
ON public.site_content 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();