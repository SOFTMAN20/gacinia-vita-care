import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { 
  Share2, 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Twitter,
  Copy,
  Mail,
  Link
} from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ShareProductProps {
  product: Product;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export function ShareProduct({ 
  product, 
  variant = 'ghost', 
  size = 'sm', 
  className = '',
  showText = false 
}: ShareProductProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // Generate product URL (in production, this would be the actual product page URL)
  const productUrl = `${window.location.origin}/products/${product.id}`;
  
  // Create share content
  const shareTitle = `Check out ${product.name} at Gacinia Pharmacy`;
  const shareDescription = `${product.name} - TZS ${product.price.toLocaleString()} | Quality medicines and healthcare products in Mbeya, Tanzania`;
  const shareImage = product.image_url;

  // Social media sharing URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(shareTitle)}`,
    
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareTitle)}&hashtags=GaciniaPharmacy,Mbeya,Healthcare`,
    
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n\n${shareDescription}\n\n${productUrl}`)}`,
    
    instagram: productUrl, // Instagram doesn't support direct sharing, so we'll copy the link
    
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Hi,\n\nI found this product at Gacinia Pharmacy that you might be interested in:\n\n${product.name}\nPrice: TZS ${product.price.toLocaleString()}\n\n${shareDescription}\n\nCheck it out: ${productUrl}\n\nBest regards`)}`,
    
    copy: productUrl
  };

  const handleShare = (platform: string) => {
    setIsOpen(false);
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(productUrl).then(() => {
          toast({
            title: "Link Copied!",
            description: "Product link has been copied to your clipboard.",
          });
        }).catch(() => {
          toast({
            title: "Copy Failed",
            description: "Unable to copy link. Please try again.",
            variant: "destructive"
          });
        });
        break;
        
      case 'instagram':
        navigator.clipboard.writeText(productUrl).then(() => {
          toast({
            title: "Link Copied for Instagram!",
            description: "Link copied! You can now paste it in your Instagram story or bio.",
          });
        });
        break;
        
      default:
        if (shareUrls[platform as keyof typeof shareUrls]) {
          window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
        }
        break;
    }
  };

  // Native Web Share API (if supported)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: productUrl,
        });
        setIsOpen(false);
      } catch (error) {
        console.log('Native sharing cancelled or failed');
      }
    }
  };

  const shareOptions = [
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'hover:bg-green-50'
    },
    {
      platform: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50'
    },
    {
      platform: 'twitter',
      label: 'Twitter',
      icon: Twitter,
      color: 'text-sky-500',
      bgColor: 'hover:bg-sky-50'
    },
    {
      platform: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'hover:bg-pink-50'
    },
    {
      platform: 'email',
      label: 'Email',
      icon: Mail,
      color: 'text-gray-600',
      bgColor: 'hover:bg-gray-50'
    },
    {
      platform: 'copy',
      label: 'Copy Link',
      icon: Copy,
      color: 'text-gray-600',
      bgColor: 'hover:bg-gray-50'
    }
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`${className} transition-colors`}
          title="Share this product"
        >
          <Share2 className="w-4 h-4" />
          {showText && <span className="ml-2">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {/* Native Share (if supported) */}
        {navigator.share && (
          <>
            <DropdownMenuItem 
              onClick={handleNativeShare}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-primary" />
              <span>Share...</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {/* Social Media Options */}
        {shareOptions.map((option) => (
          <DropdownMenuItem
            key={option.platform}
            onClick={() => handleShare(option.platform)}
            className={`flex items-center gap-3 cursor-pointer ${option.bgColor}`}
          >
            <option.icon className={`w-4 h-4 ${option.color}`} />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Product Info */}
        <div className="px-2 py-2 text-xs text-muted-foreground">
          <p className="font-medium truncate">{product.name}</p>
          <p>TZS {product.price.toLocaleString()}</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
