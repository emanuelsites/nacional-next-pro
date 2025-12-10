-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can create enrollments" ON public.enrollments;

-- Create a truly PERMISSIVE policy for public inserts
CREATE POLICY "Public can create enrollments" 
ON public.enrollments 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);