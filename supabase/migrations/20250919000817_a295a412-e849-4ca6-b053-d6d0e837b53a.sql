-- Enable Row Level Security for products table if not already enabled
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Set up realtime for products table
ALTER TABLE public.products REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- Create a function to notify on product changes (optional, for additional logging)
CREATE OR REPLACE FUNCTION notify_product_change()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create triggers for product changes (optional, for logging)
DROP TRIGGER IF EXISTS product_change_trigger ON public.products;
CREATE TRIGGER product_change_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION notify_product_change();