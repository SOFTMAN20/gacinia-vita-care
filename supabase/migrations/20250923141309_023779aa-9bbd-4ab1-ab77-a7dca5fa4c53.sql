-- Fix security issues by enabling RLS on missing tables and fixing function search paths

-- Enable RLS on brands table
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create policies for brands table
CREATE POLICY "Brands are viewable by everyone" 
ON public.brands 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage brands" 
ON public.brands 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Enable RLS on suppliers table
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies for suppliers table
CREATE POLICY "Only admins can view suppliers" 
ON public.suppliers 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can manage suppliers" 
ON public.suppliers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix function search paths to improve security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_product_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the change for debugging
  RAISE LOG 'Product change detected: % on product %', TG_OP, COALESCE(NEW.name, OLD.name);
  
  -- Return the appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(EXTRACT(epoch FROM NOW())::bigint::text, 10, '0');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_cart_items()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM cart_items WHERE expires_at < NOW();
END;
$$;

CREATE OR REPLACE FUNCTION public.extend_cart_item_expiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Extend expiry by 7 days when cart item is updated
  NEW.expires_at = NOW() + INTERVAL '7 days';
  RETURN NEW;
END;
$$;