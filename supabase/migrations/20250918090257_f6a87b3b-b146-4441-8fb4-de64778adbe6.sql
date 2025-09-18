-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  name_swahili VARCHAR(100),
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand VARCHAR(100),
  sku VARCHAR(50) UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  wholesale_price DECIMAL(10,2),
  image_url TEXT,
  images TEXT[],
  in_stock BOOLEAN DEFAULT true,
  stock_count INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 5,
  requires_prescription BOOLEAN DEFAULT false,
  wholesale_available BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  key_features TEXT[],
  technical_specs JSONB,
  usage_instructions TEXT,
  dosage TEXT,
  ingredients TEXT,
  storage_requirements TEXT,
  expiry_date DATE,
  batch_number VARCHAR(50),
  manufacturer VARCHAR(100),
  weight VARCHAR(20),
  dimensions VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_brand ON public.products(brand);
CREATE INDEX idx_products_in_stock ON public.products(in_stock);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_products_requires_prescription ON public.products(requires_prescription);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories (public read access)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- Insert sample categories based on frontend
INSERT INTO public.categories (name, name_swahili, slug, description, sort_order) VALUES
('Prescription Medicines', 'Dawa za Prescription', 'prescription-medicines', 'Medicines that require a prescription from a licensed medical practitioner', 1),
('Over-the-Counter', 'Dawa za Kawaida', 'over-the-counter', 'Medicines available without prescription for common ailments', 2),
('Cosmetics & Personal Care', 'Vipodozi na Huduma za Kibinafsi', 'cosmetics-personal-care', 'Beauty products, skincare, and personal hygiene items', 3),
('First Aid & Wellness', 'Huduma za Kwanza na Afya', 'first-aid-wellness', 'First aid supplies and wellness products', 4),
('Medical Supplies', 'Vifaa vya Kidaktari', 'medical-supplies', 'Medical equipment and supplies for healthcare professionals', 5);