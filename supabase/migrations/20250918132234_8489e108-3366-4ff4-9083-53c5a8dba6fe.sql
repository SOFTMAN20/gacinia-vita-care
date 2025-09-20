-- Create RLS policies for public read access to products and categories

-- Enable RLS on products table (if not already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Enable RLS on categories table (if not already enabled)  
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active products
CREATE POLICY "Anyone can view active products" ON public.products
FOR SELECT USING (is_active = true);

-- Allow everyone to read active categories
CREATE POLICY "Anyone can view active categories" ON public.categories  
FOR SELECT USING (is_active = true);

-- Only authenticated users can insert/update/delete products (admin functionality)
CREATE POLICY "Only authenticated users can manage products" ON public.products
FOR ALL USING (auth.role() = 'authenticated');

-- Only authenticated users can insert/update/delete categories (admin functionality)
CREATE POLICY "Only authenticated users can manage categories" ON public.categories
FOR ALL USING (auth.role() = 'authenticated');