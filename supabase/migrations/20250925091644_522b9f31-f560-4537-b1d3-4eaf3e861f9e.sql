-- Insert initial brands into the brands table
INSERT INTO public.brands (name, description, country_of_origin, is_active) VALUES
('Panadol', 'Leading pain relief and fever management brand', 'United Kingdom', true),
('GSK', 'GlaxoSmithKline - Global healthcare company', 'United Kingdom', true),
('Pfizer', 'American multinational pharmaceutical corporation', 'United States', true),
('Johnson & Johnson', 'American multinational healthcare corporation', 'United States', true),
('Bayer', 'German multinational pharmaceutical company', 'Germany', true),
('Novartis', 'Swiss multinational pharmaceutical company', 'Switzerland', true),
('Local Brand', 'Tanzania local pharmaceutical brands', 'Tanzania', true),
('Roche', 'Swiss multinational healthcare company', 'Switzerland', true),
('Merck', 'American multinational pharmaceutical company', 'United States', true),
('Sanofi', 'French multinational pharmaceutical company', 'France', true),
('AstraZeneca', 'British-Swedish multinational pharmaceutical company', 'United Kingdom', true),
('Abbott', 'American multinational medical devices company', 'United States', true),
('Boehringer Ingelheim', 'German pharmaceutical company', 'Germany', true),
('Cipla', 'Indian multinational pharmaceutical company', 'India', true),
('Teva', 'Israeli multinational pharmaceutical company', 'Israel', true)
ON CONFLICT (name) DO NOTHING;