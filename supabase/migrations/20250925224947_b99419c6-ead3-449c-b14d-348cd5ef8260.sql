-- Add RLS policy to allow admins to view all profiles for dashboard
CREATE POLICY "Admins can view all profiles for dashboard" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));