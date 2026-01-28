-- Create a secure function for login lookup (returns only necessary data for auth)
CREATE OR REPLACE FUNCTION public.get_login_credentials(p_phone_number text)
RETURNS TABLE (email text, pin_hash text, user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.email, p.pin_hash, p.user_id
  FROM public.profiles p
  WHERE p.phone_number = p_phone_number
  LIMIT 1;
END;
$$;