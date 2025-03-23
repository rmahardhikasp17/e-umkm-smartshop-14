
-- Create function to get a user's profile by ID
CREATE OR REPLACE FUNCTION public.get_profile_by_id(user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  role TEXT,
  full_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.email, p.role, p.full_name
  FROM public.profiles p
  WHERE p.id = user_id;
END;
$$;
