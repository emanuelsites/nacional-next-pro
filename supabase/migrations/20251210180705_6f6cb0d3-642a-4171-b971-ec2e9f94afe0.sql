-- Drop the restrictive policy and create a permissive one for public enrollment
DROP POLICY IF EXISTS "Anyone can create enrollments" ON public.enrollments;

CREATE POLICY "Anyone can create enrollments" 
ON public.enrollments 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);