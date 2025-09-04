-- STEP 2: Complete Database Schema Enhancement for Pharmacy System

-- 1. Enhance existing profiles table with additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'sw'));

-- Update role constraint to include new roles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('customer', 'admin', 'pharmacist', 'wholesale_customer', 'staff'));

-- 2. Create user_addresses table
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  full_address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Mbeya',
  region TEXT NOT NULL DEFAULT 'Mbeya',
  postal_code TEXT,
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  country_of_origin TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  tax_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Add parent_id to categories for hierarchy support
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id);

-- 6. Enhance products table with comprehensive fields
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.brands(id),
ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id),
ADD COLUMN IF NOT EXISTS barcode TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS retail_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS reorder_level INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS max_stock_level INTEGER,
ADD COLUMN IF NOT EXISTS is_prescription_only BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_wholesale_only BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS dosage_form TEXT,
ADD COLUMN IF NOT EXISTS strength TEXT,
ADD COLUMN IF NOT EXISTS active_ingredients TEXT[],
ADD COLUMN IF NOT EXISTS usage_instructions TEXT,
ADD COLUMN IF NOT EXISTS usage_instructions_sw TEXT,
ADD COLUMN IF NOT EXISTS side_effects TEXT,
ADD COLUMN IF NOT EXISTS contraindications TEXT,
ADD COLUMN IF NOT EXISTS storage_conditions TEXT,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Rename price to retail_price for consistency if needed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'price' AND table_schema = 'public') THEN
    UPDATE public.products SET retail_price = price WHERE retail_price IS NULL;
  END IF;
END $$;

-- 7. Update cart_items to reference profiles instead of auth.users
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 8. Enhance orders table with comprehensive fields
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'retail' CHECK (order_type IN ('retail', 'wholesale')),
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_method TEXT DEFAULT 'delivery' CHECK (delivery_method IN ('delivery', 'pickup')),
ADD COLUMN IF NOT EXISTS delivery_notes TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;

-- Update orders to reference profiles
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE public.orders ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- Update status constraints
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'));

-- 9. Create order_status_history table
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Enable RLS on all new tables
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies for user_addresses
CREATE POLICY "Users can manage their own addresses" 
ON public.user_addresses FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = user_addresses.user_id 
  AND profiles.user_id = auth.uid()
));

-- 12. Create RLS policies for brands (public read, admin write)
CREATE POLICY "Brands are viewable by everyone" 
ON public.brands FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage brands" 
ON public.brands FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'pharmacist')
));

-- 13. Create RLS policies for suppliers (admin only)
CREATE POLICY "Only admins can view suppliers" 
ON public.suppliers FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'pharmacist')
));

CREATE POLICY "Only admins can manage suppliers" 
ON public.suppliers FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'pharmacist')
));

-- 14. Create RLS policies for order_status_history
CREATE POLICY "Users can view their order history" 
ON public.order_status_history FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders 
  JOIN public.profiles ON orders.user_id = profiles.id
  WHERE orders.id = order_status_history.order_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Staff can manage order history" 
ON public.order_status_history FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'pharmacist', 'staff')
));

-- 15. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_is_default ON public.user_addresses(user_id) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_reorder_level ON public.products(stock_quantity, reorder_level) WHERE stock_quantity <= reorder_level;
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON public.orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_method ON public.orders(delivery_method);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON public.order_status_history(created_at DESC);

-- 16. Create trigger for order status history
CREATE OR REPLACE FUNCTION public.create_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.order_status_history (order_id, status, notes, created_by)
  VALUES (NEW.id, NEW.status, 'Order status updated', NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_order_status_history
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.create_order_status_history();

-- 17. Insert sample brands
INSERT INTO public.brands (name, description, country_of_origin) VALUES
('GlaxoSmithKline', 'Global pharmaceutical company', 'United Kingdom'),
('Pfizer', 'American multinational pharmaceutical corporation', 'United States'),
('Novartis', 'Swiss multinational pharmaceutical company', 'Switzerland'),
('Johnson & Johnson', 'American multinational corporation', 'United States'),
('Roche', 'Swiss multinational healthcare company', 'Switzerland')
ON CONFLICT (name) DO NOTHING;

-- 18. Insert sample suppliers
INSERT INTO public.suppliers (name, contact_person, email, phone, address) VALUES
('Mbeya Medical Distributors', 'John Mwambapa', 'info@mbeyamedical.co.tz', '+255-25-2502345', 'Mbeya Industrial Area'),
('Tanzania Pharmaceuticals Ltd', 'Sarah Kimaro', 'orders@tanzpharm.co.tz', '+255-22-2123456', 'Dar es Salaam'),
('East Africa Medical Supplies', 'David Msigwa', 'sales@eamedicalsupplies.com', '+255-25-2501234', 'Mbeya Town Center')
ON CONFLICT DO NOTHING;