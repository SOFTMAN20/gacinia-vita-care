import { Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

interface CartItemExpiryProps {
  expiresAt?: Date;
  className?: string;
}

export function CartItemExpiry({ expiresAt, className }: CartItemExpiryProps) {
  if (!expiresAt) return null;

  const now = new Date();
  const timeUntilExpiry = expiresAt.getTime() - now.getTime();
  const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);
  
  // Don't show if expired
  if (timeUntilExpiry <= 0) return null;

  const isExpiringSoon = hoursUntilExpiry < 24; // Less than 24 hours
  const expiryText = formatDistanceToNow(expiresAt, { addSuffix: true });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={isExpiringSoon ? "destructive" : "secondary"} 
            className={`text-xs ${className}`}
          >
            {isExpiringSoon ? (
              <AlertTriangle className="w-3 h-3 mr-1" />
            ) : (
              <Clock className="w-3 h-3 mr-1" />
            )}
            {isExpiringSoon ? 'Expires soon' : 'Temporary'}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cart item expires {expiryText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}