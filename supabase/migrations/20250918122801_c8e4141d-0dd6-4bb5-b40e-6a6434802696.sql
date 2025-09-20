-- Fix recursive RLS on profiles causing 42P17 errors
-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop the recursive policy if it exists
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a non-recursive admin policy using JWT claim
CREATE POLICY "Admins can view all profiles"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'role') = 'admin');