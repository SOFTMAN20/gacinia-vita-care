-- Insert categories with proper UUIDs
INSERT INTO public.categories (name, name_swahili, slug, description, is_active, sort_order) VALUES
('Prescription Medicines', 'Dawa za Prescription', 'prescription-medicines', 'Medicines that require a valid prescription from a licensed healthcare provider', true, 1),
('Over-the-Counter', 'Dawa za Kawaida', 'over-the-counter', 'Medicines available without prescription for common health issues', true, 2),
('Cosmetics & Personal Care', 'Vipodozi na Huduma za Kibinafsi', 'cosmetics-personal-care', 'Beauty, skincare, and personal hygiene products', true, 3),
('First Aid & Wellness', 'Huduma za Kwanza na Afya', 'first-aid-wellness', 'Emergency medical supplies and wellness products', true, 4),
('Medical Equipment', 'Vifaa vya Kidaktari', 'medical-equipment', 'Professional medical devices and diagnostic equipment', true, 5);

-- Get category IDs for products
DO $$
DECLARE
    prescription_id uuid;
    otc_id uuid;
    cosmetics_id uuid;
    first_aid_id uuid;
    equipment_id uuid;
BEGIN
    SELECT id INTO prescription_id FROM public.categories WHERE slug = 'prescription-medicines';
    SELECT id INTO otc_id FROM public.categories WHERE slug = 'over-the-counter';
    SELECT id INTO cosmetics_id FROM public.categories WHERE slug = 'cosmetics-personal-care';
    SELECT id INTO first_aid_id FROM public.categories WHERE slug = 'first-aid-wellness';
    SELECT id INTO equipment_id FROM public.categories WHERE slug = 'medical-equipment';

    -- Insert products with proper category references
    INSERT INTO public.products (
        name, price, original_price, image_url, category_id, in_stock, stock_count, 
        requires_prescription, wholesale_available, rating, review_count, is_active, featured
    ) VALUES
    ('Panadol Extra Tablets', 2500, 3000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', otc_id, true, 45, false, true, 4.5, 128, true, true),
    ('Blood Pressure Monitor', 85000, null, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop', equipment_id, true, 15, false, true, 4.8, 67, true, true),
    ('Amoxicillin 500mg Capsules', 4500, null, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop', prescription_id, true, 30, true, true, 4.6, 89, true, false),
    ('Nivea Daily Moisturizer', 8500, 10000, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', cosmetics_id, true, 78, false, false, 4.3, 156, true, false),
    ('First Aid Kit Complete', 25000, null, 'https://images.unsplash.com/photo-1603398938749-956d3e8a1d42?w=400&h=400&fit=crop', first_aid_id, true, 22, false, true, 4.7, 45, true, true),
    ('Insulin Glargine', 45000, null, 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop', prescription_id, false, 0, true, true, 4.9, 234, true, false),
    ('Digital Thermometer', 12000, 15000, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop', equipment_id, true, 67, false, true, 4.4, 92, true, false),
    ('Vitamin C Tablets', 6500, null, 'https://images.unsplash.com/photo-1550572017-4a5c2ed3d328?w=400&h=400&fit=crop', otc_id, true, 3, false, true, 4.2, 178, true, false),
    ('Sunscreen SPF 50', 15000, null, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop', cosmetics_id, true, 45, false, false, 4.5, 134, true, false),
    ('Wound Dressing Kit', 18000, null, 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop', first_aid_id, true, 28, false, true, 4.6, 67, true, false),
    ('Metformin 500mg', 3500, null, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop', prescription_id, true, 120, true, true, 4.7, 298, true, true),
    ('Hand Sanitizer 500ml', 4500, null, 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=400&fit=crop', cosmetics_id, true, 89, false, true, 4.1, 203, true, false);
END $$;