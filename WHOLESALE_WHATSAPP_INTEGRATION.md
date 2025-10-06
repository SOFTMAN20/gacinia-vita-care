# Wholesale WhatsApp Integration

## Feature
Connected the "Contact for Wholesale" button in product details to WhatsApp for direct wholesale inquiries.

## Implementation

### Location
`src/components/product/PurchaseOptions.tsx`

### How It Works

When a user clicks the "Contact for Wholesale" button on a product with wholesale availability:

1. **Opens WhatsApp** in a new tab/window
2. **Pre-fills message** with:
   - Product name
   - Wholesale price (if available)
   - Request for bulk order discussion
3. **Direct contact** to Gacinia Pharmacy WhatsApp: +255 621 624 287

### Message Template

```
Hello, I'm interested in wholesale pricing for:

*[Product Name]*
Wholesale Price: TZS [Price]

I would like to discuss bulk order options.
```

### Example

For a product like "Panadol Extra" with wholesale price TZS 10,000:

```
Hello, I'm interested in wholesale pricing for:

*Panadol Extra*
Wholesale Price: TZS 10,000

I would like to discuss bulk order options.
```

### Benefits

✅ **Instant Communication** - Direct WhatsApp contact
✅ **Pre-filled Context** - Customer doesn't need to type product details
✅ **Professional** - Formatted message with product information
✅ **Mobile-Friendly** - Opens WhatsApp app on mobile devices
✅ **Convenient** - One-click to start conversation

### User Experience

1. User views product with wholesale availability
2. Sees "Wholesale Available" card with pricing
3. Clicks "Contact for Wholesale" button
4. WhatsApp opens with pre-filled message
5. User can immediately send or edit message
6. Direct conversation with Gacinia Pharmacy team

### Technical Details

- **Phone Number**: 255621624287 (international format without +)
- **URL Format**: `https://wa.me/{phone}?text={encoded_message}`
- **Opens in**: New tab/window (`_blank`)
- **Message Encoding**: URL-encoded for special characters

## Testing

To test the feature:
1. Navigate to any product with `wholesale_available = true`
2. Scroll to "Wholesale Available" section
3. Click "Contact for Wholesale" button
4. Verify WhatsApp opens with correct message
5. Check product name and price are included

## Future Enhancements

Potential improvements:
- Add quantity field before opening WhatsApp
- Include product SKU in message
- Track wholesale inquiry conversions
- Add alternative contact methods (email, phone)
