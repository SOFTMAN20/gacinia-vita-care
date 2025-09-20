// Property mapping for Supabase migration
// Old camelCase properties -> New snake_case properties

export const PROPERTY_MAPPINGS = {
  // Image properties
  'image': 'image_url',
  
  // Price properties
  'originalPrice': 'original_price',
  'wholesalePrice': 'wholesale_price',
  
  // Stock properties  
  'inStock': 'in_stock',
  'stockCount': 'stock_count',
  
  // Prescription and availability
  'requiresPrescription': 'requires_prescription',
  'wholesaleAvailable': 'wholesale_available',
  
  // Review properties
  'reviewCount': 'review_count',
  
  // Feature properties
  'keyFeatures': 'key_features',
  'technicalSpecs': 'technical_specs',
  'usageInstructions': 'usage_instructions',
  'storageRequirements': 'storage_requirements',
  
  // Batch and expiry
  'batchNumber': 'batch_number',
  'expiryDate': 'expiry_date',
  
  // Category properties (for nested objects)
  'nameSwahili': 'name_swahili'
};

// Helper function to check if we need to update a property access
export function shouldUpdateProperty(propertyName: string): boolean {
  return propertyName in PROPERTY_MAPPINGS;
}

// Helper function to get the correct property name
export function getCorrectPropertyName(oldProperty: string): string {
  return PROPERTY_MAPPINGS[oldProperty as keyof typeof PROPERTY_MAPPINGS] || oldProperty;
}