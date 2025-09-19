import { useEffect, useState } from 'react';
import { Wifi, WifiOff, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

interface ConnectionStatusProps {
  status: ConnectionStatus;
  lastConnected: Date | null;
  retryCount: number;
  error: string | null;
  onReconnect: () => void;
  className?: string;
  showDetails?: boolean;
}

export function ConnectionStatus({
  status,
  lastConnected,
  retryCount,
  error,
  onReconnect,
  className,
  showDetails = false
}: ConnectionStatusProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');

  // Update time ago display
  useEffect(() => {
    if (!lastConnected) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = now.getTime() - lastConnected.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (minutes > 0) {
        setTimeAgo(`${minutes}m ago`);
      } else {
        setTimeAgo(`${seconds}s ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    
    return () => clearInterval(interval);
  }, [lastConnected]);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Connected',
          variant: 'default' as const
        };
      case 'connecting':
      case 'reconnecting':
        return {
          icon: RotateCcw,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: status === 'reconnecting' ? 'Reconnecting' : 'Connecting',
          variant: 'secondary' as const,
          animate: true
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
          label: 'Disconnected',
          variant: 'outline' as const
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          label: 'Error',
          variant: 'destructive' as const
        };
      default:
        return {
          icon: WifiOff,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
          label: 'Unknown',
          variant: 'outline' as const
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (!showDetails) {
    // Compact status indicator
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("flex items-center gap-2", className)}>
              <div className={cn(
                "p-1.5 rounded-full",
                config.bgColor
              )}>
                <Icon className={cn(
                  "w-3 h-3",
                  config.color,
                  config.animate && "animate-spin"
                )} />
              </div>
              <Badge variant={config.variant} className="text-xs">
                {config.label}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">Real-time Status: {config.label}</div>
              {lastConnected && (
                <div className="text-xs text-muted-foreground mt-1">
                  Last connected: {timeAgo}
                </div>
              )}
              {error && (
                <div className="text-xs text-destructive mt-1">
                  Error: {error}
                </div>
              )}
              {retryCount > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Retry attempts: {retryCount}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Detailed status card
  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-full",
              config.bgColor
            )}>
              <Icon className={cn(
                "w-4 h-4",
                config.color,
                config.animate && "animate-spin"
              )} />
            </div>
            <div>
              <div className="font-medium text-sm">Real-time Updates</div>
              <Badge variant={config.variant} className="text-xs">
                {config.label}
              </Badge>
            </div>
          </div>
          
          {(status === 'disconnected' || status === 'error') && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReconnect}
              className="ml-2"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          {lastConnected && (
            <div>Last connected: {timeAgo}</div>
          )}
          
          {error && (
            <div className="text-destructive">
              Error: {error}
            </div>
          )}
          
          {retryCount > 0 && (
            <div>
              Retry attempts: {retryCount}
            </div>
          )}

          <div className="pt-2 border-t">
            <div className="text-xs">
              Real-time product updates {status === 'connected' ? 'active' : 'inactive'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}