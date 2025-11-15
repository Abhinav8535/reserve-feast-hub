-- Update the trigger function to handle new profile fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, phone_number, restaurant_name, business_email)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'),
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'restaurant_name',
    NEW.raw_user_meta_data->>'business_email'
  );
  RETURN NEW;
END;
$function$;