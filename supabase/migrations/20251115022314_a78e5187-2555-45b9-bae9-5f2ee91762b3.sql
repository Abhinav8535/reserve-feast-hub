-- Add additional profile fields for role-specific information
ALTER TABLE public.profiles 
ADD COLUMN phone_number TEXT,
ADD COLUMN restaurant_name TEXT,
ADD COLUMN business_email TEXT;