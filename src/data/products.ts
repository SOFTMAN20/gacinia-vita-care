import { Product } from '@/components/ui/product-card';

export const categories = [
  {
    id: '1',
    name: 'Prescription Medicines',
    nameSwahili: 'Dawa za Prescription',
    slug: 'prescription-medicines',
    count: 45
  },
  {
    id: '2',
    name: 'Over-the-Counter',
    nameSwahili: 'Dawa za Kawaida',
    slug: 'over-the-counter',
    count: 38
  },
  {
    id: '3',
    name: 'Cosmetics & Personal Care',
    nameSwahili: 'Vipodozi na Huduma za Kibinafsi',
    slug: 'cosmetics-personal-care',
    count: 52
  },
  {
    id: '4',
    name: 'First Aid & Wellness',
    nameSwahili: 'Huduma za Kwanza na Afya',
    slug: 'first-aid-wellness',
    count: 28
  },
  {
    id: '5',
    name: 'Medical Equipment',
    nameSwahili: 'Vifaa vya Kidaktari',
    slug: 'medical-equipment',
    count: 34
  }
];

export const brands = [
  'Panadol', 'Cipla', 'GSK', 'Pfizer', 'Johnson & Johnson', 'Unilever',
  'Nivea', 'L\'Oreal', 'Beiersdorf', 'Abbott', 'Roche', 'Novartis'
];

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Panadol Extra Tablets',
    price: 2500,
    originalPrice: 3000,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    category: 'over-the-counter',
    inStock: true,
    stockCount: 45,
    requiresPrescription: false,
    wholesaleAvailable: true,
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: '2',
    name: 'Blood Pressure Monitor',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
    category: 'medical-equipment',
    inStock: true,
    stockCount: 15,
    requiresPrescription: false,
    wholesaleAvailable: true,
    rating: 4.8,
    reviewCount: 67
  },
  {
    id: '3',
    name: 'Amoxicillin 500mg Capsules',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop',
    category: 'prescription-medicines',
    inStock: true,
    stockCount: 30,
    requiresPrescription: true,
    wholesaleAvailable: true,
    rating: 4.6,
    reviewCount: 89
  },
  {
    id: '4',
    name: 'Nivea Daily Moisturizer',
    price: 8500,
    originalPrice: 10000,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    category: 'cosmetics-personal-care',
    inStock: true,
    stockCount: 78,
    requiresPrescription: false,
    wholesaleAvailable: false,
    rating: 4.3,
    reviewCount: 156
  },
  {
    id: '5',
    name: 'First Aid Kit Complete',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1603398938749-956d3e8a1d42?w=400&h=400&fit=crop',
    category: 'first-aid-wellness',
    inStock: true,
    stockCount: 22,
    requiresPrescription: false,
    wholesaleAvailable: true,
    rating: 4.7,
    reviewCount: 45
  },
  {
    id: '6',
    name: 'Insulin Glargine',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop',
    category: 'prescription-medicines',
    inStock: false,
    stockCount: 0,
    requiresPrescription: true,
    wholesaleAvailable: true,
    rating: 4.9,
    reviewCount: 234
  },
  {
    id: '7',
    name: 'Digital Thermometer',
    price: 12000,
    originalPrice: 15000,
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop',
    category: 'medical-equipment',
    inStock: true,
    stockCount: 67,
    requiresPrescription: false,
    wholesaleAvailable: true,
    rating: 4.4,
    reviewCount: 92
  },
  {
    id: '8',
    name: 'Vitamin C Tablets',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1550572017-4a5c2ed3d328?w=400&h=400&fit=crop',
    category: 'over-the-counter',
    inStock: true,
    stockCount: 3,
    requiresPrescription: false,
    wholesaleAvailable: true,
    rating: 4.2,
    reviewCount: 178
  },
  {
    id: '9',
    name: 'Sunscreen SPF 50',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    category: 'cosmetics-personal-care',
    inStock: true,
    stockCount: 45,
    requiresPrescription: false,
    wholesaleAvailable: false,
    rating: 4.5,
    reviewCount: 134
  },
  {
    id: '10',
    name: 'Wound Dressing Kit',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop',
    category: 'first-aid-wellness',
    inStock: true,
    stockCount: 28,
    requiresPrescription: false,
    wholesaleAvailable: true,
    rating: 4.6,
    reviewCount: 67
  },
  {
    id: '11',
    name: 'Metformin 500mg',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop',
    category: 'prescription-medicines',
    inStock: true,
    stockCount: 120,
    requiresPrescription: true,
    wholesaleAvailable: true,
    rating: 4.7,
    reviewCount: 298
  },
  {
    id: '12',
    name: 'Hand Sanitizer 500ml',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=400&fit=crop',
    category: 'cosmetics-personal-care',
    inStock: true,
    stockCount: 89,
    requiresPrescription: false,
    wholesaleAvailable: true,
    rating: 4.1,
    reviewCount: 203
  }
];