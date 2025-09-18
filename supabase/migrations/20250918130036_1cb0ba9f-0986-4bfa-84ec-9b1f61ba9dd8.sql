-- Update the Medical Supplies category to Medical Equipment to match our mock data
UPDATE public.categories SET name = 'Medical Equipment', name_swahili = 'Vifaa vya Kidaktari', slug = 'medical-equipment' WHERE slug = 'medical-supplies';

-- Insert products with correct category references
INSERT INTO public.products (
    name, price, original_price, image_url, category_id, in_stock, stock_count, 
    requires_prescription, wholesale_available, rating, review_count, is_active, featured
) VALUES
('Panadol Extra Tablets', 2500, 3000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'over-the-counter'), true, 45, false, true, 4.5, 128, true, true),
('Blood Pressure Monitor', 85000, null, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'medical-equipment'), true, 15, false, true, 4.8, 67, true, true),
('Amoxicillin 500mg Capsules', 4500, null, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'prescription-medicines'), true, 30, true, true, 4.6, 89, true, false),
('Nivea Daily Moisturizer', 8500, 10000, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'cosmetics-personal-care'), true, 78, false, false, 4.3, 156, true, false),
('First Aid Kit Complete', 25000, null, 'https://images.unsplash.com/photo-1603398938749-956d3e8a1d42?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'first-aid-wellness'), true, 22, false, true, 4.7, 45, true, true),
('Insulin Glargine', 45000, null, 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'prescription-medicines'), false, 0, true, true, 4.9, 234, true, false),
('Digital Thermometer', 12000, 15000, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'medical-equipment'), true, 67, false, true, 4.4, 92, true, false),
('Vitamin C Tablets', 6500, null, 'https://images.unsplash.com/photo-1550572017-4a5c2ed3d328?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'over-the-counter'), true, 3, false, true, 4.2, 178, true, false),
('Sunscreen SPF 50', 15000, null, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'cosmetics-personal-care'), true, 45, false, false, 4.5, 134, true, false),
('Wound Dressing Kit', 18000, null, 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'first-aid-wellness'), true, 28, false, true, 4.6, 67, true, false),
('Metformin 500mg', 3500, null, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'prescription-medicines'), true, 120, true, true, 4.7, 298, true, true),
('Hand Sanitizer 500ml', 4500, null, 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=400&fit=crop', (SELECT id FROM public.categories WHERE slug = 'cosmetics-personal-care'), true, 89, false, true, 4.1, 203, true, false);