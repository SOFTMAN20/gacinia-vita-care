-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('categories-images', 'categories-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for category images bucket
CREATE POLICY "Category images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'categories-images');

CREATE POLICY "Authenticated users can upload category images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'categories-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update category images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'categories-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete category images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'categories-images' AND auth.role() = 'authenticated');