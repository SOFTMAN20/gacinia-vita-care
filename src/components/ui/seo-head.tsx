import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function SEOHead({
  title = 'Gacinia Pharmacy & Medical Supplies - Mbeya',
  description = 'Quality pharmacy and medical supplies in Mbeya, Tanzania. Prescription medicines, cosmetics, medical equipment and wholesale supplies.',
  keywords = ['pharmacy', 'medical supplies', 'Mbeya', 'Tanzania', 'medicines', 'cosmetics', 'healthcare'],
  canonicalUrl,
  ogImage = '/og-image.jpg',
  noIndex = false
}: SEOHeadProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    
    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', 'website', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Robots tag
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Canonical URL
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // Structured data for pharmacy
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Pharmacy",
      "name": "Gacinia Pharmacy & Medical Supplies",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Esso - Near Highway",
        "addressLocality": "Mbeya",
        "addressCountry": "Tanzania"
      },
      "telephone": "+255-25-250-3456",
      "description": description,
      "openingHours": "Mo-Sa 08:00-20:00"
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, canonicalUrl, ogImage, noIndex]);

  return null; // This component doesn't render anything
}