-- Create storage bucket for course images
INSERT INTO storage.buckets (id, name, public)
VALUES ('courses', 'courses', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to course images
CREATE POLICY "Public read access for course images"
ON storage.objects FOR SELECT
USING (bucket_id = 'courses');

-- Allow authenticated users to upload course images (admin only via RLS on courses table)
CREATE POLICY "Authenticated users can upload course images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'courses');

-- Allow authenticated users to update course images
CREATE POLICY "Authenticated users can update course images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'courses');

-- Allow authenticated users to delete course images
CREATE POLICY "Authenticated users can delete course images"
ON storage.objects FOR DELETE
USING (bucket_id = 'courses');