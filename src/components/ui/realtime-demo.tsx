import React from 'react';
import { Wifi, WifiOff, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealtimeProducts } from '@/hooks/useRealtimeProducts';
import { ConnectionStatus } from '@/components/ui/connection-status';

export function RealtimeStatusDemo() {
  const realtimeStatus = useRealtimeProducts();

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Real-time Product Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connection Status:</span>
            <ConnectionStatus
              status={realtimeStatus.status}
              lastConnected={realtimeStatus.lastConnected}
              retryCount={realtimeStatus.retryCount}
              error={realtimeStatus.error}
              onReconnect={realtimeStatus.reconnect}
            />
          </div>

          {realtimeStatus.isConnected && (
            <div className="text-sm text-muted-foreground bg-success/10 p-3 rounded-lg">
              ✅ You'll receive real-time notifications when:
              <ul className="mt-2 space-y-1 ml-4">
                <li>• New products are added</li>
                <li>• Product prices change</li>
                <li>• Stock levels update</li>
                <li>• Products go in/out of stock</li>
              </ul>
            </div>
          )}

          {!realtimeStatus.isConnected && (
            <div className="text-sm text-muted-foreground bg-warning/10 p-3 rounded-lg">
              ⚠️ Real-time updates are currently disconnected. Product changes may not appear immediately.
            </div>
          )}

          <div className="pt-4 border-t">
            <ConnectionStatus
              status={realtimeStatus.status}
              lastConnected={realtimeStatus.lastConnected}
              retryCount={realtimeStatus.retryCount}
              error={realtimeStatus.error}
              onReconnect={realtimeStatus.reconnect}
              showDetails={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}