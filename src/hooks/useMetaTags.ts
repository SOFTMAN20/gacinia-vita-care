import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

export function useMetaTags({
  title,
  description,
  image,
  url,
  type = 'website',
  siteName = 'Gacinia Pharmacy & Medical Supplies'
}: MetaTagsProps) {
  useEffect(() => {
    // Store original meta tags to restore later
    const originalTags: { [key: string]: string } = {};
    
    // Ensure image URL is absolute and valid
    const getAbsoluteImageUrl = (imageUrl?: string) => {
      // If no image provided, use default
      if (!imageUrl) {
        return `${window.location.origin}/og-image.jpg`;
      }
      
      // If already absolute, use as is
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      
      // Make relative URLs absolute
      const baseUrl = window.location.origin;
      if (imageUrl.startsWith('/')) {
        return `${baseUrl}${imageUrl}`;
      }
      
      return `${baseUrl}/${imageUrl}`;
    };
    
    const absoluteImageUrl = getAbsoluteImageUrl(image);
    
    // Meta tags to update
    const metaTags = [
      // Open Graph tags
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: absoluteImageUrl },
      { property: 'og:image:secure_url', content: absoluteImageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:alt', content: `${title} - ${siteName}` },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: absoluteImageUrl },
      { name: 'twitter:image:alt', content: `${title} - ${siteName}` },
      
      // WhatsApp specific (uses Open Graph)
      { property: 'og:image:url', content: absoluteImageUrl },
      
      // General meta tags
      { name: 'description', content: description },
      
      // Additional image meta for better compatibility
      { name: 'image', content: absoluteImageUrl }
    ];

    // Update document title
    if (title) {
      originalTags.title = document.title;
      document.title = `${title} | ${siteName}`;
    }

    // Update or create meta tags
    metaTags.forEach(({ property, name, content }) => {
      if (!content) return;

      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector) as HTMLMetaElement;
      
      if (metaTag) {
        // Store original content
        const key = property || name || '';
        originalTags[key] = metaTag.content;
        // Update existing tag
        metaTag.content = content;
      } else {
        // Create new tag
        metaTag = document.createElement('meta');
        if (property) metaTag.setAttribute('property', property);
        if (name) metaTag.setAttribute('name', name);
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
    });

    // Cleanup function to restore original tags
    return () => {
      // Restore original title
      if (originalTags.title) {
        document.title = originalTags.title;
      }

      // Restore or remove meta tags
      metaTags.forEach(({ property, name }) => {
        const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
        const metaTag = document.querySelector(selector) as HTMLMetaElement;
        const key = property || name || '';
        
        if (metaTag) {
          if (originalTags[key]) {
            metaTag.content = originalTags[key];
          } else {
            metaTag.remove();
          }
        }
      });
    };
  }, [title, description, image, url, type, siteName]);
}