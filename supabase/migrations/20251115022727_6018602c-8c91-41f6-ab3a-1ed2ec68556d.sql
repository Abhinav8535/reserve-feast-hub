-- Fix search_path for generate_token_number function
CREATE OR REPLACE FUNCTION public.generate_token_number()
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  new_token INTEGER;
BEGIN
  SELECT COALESCE(MAX(token_number), 0) + 1 INTO new_token FROM public.orders;
  RETURN new_token;
END;
$function$;