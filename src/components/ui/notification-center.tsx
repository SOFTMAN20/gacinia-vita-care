import { useState } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-auto p-1 text-xs"
            >
              <CheckCheck size={14} className="mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 cursor-pointer",
                  !notification.is_read && "bg-muted/50"
                )}
                onClick={() => handleNotificationClick(notification.id, notification.is_read)}
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm leading-none">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.is_read && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                {notification.data && (
                  <div className="w-full">
                    {notification.type === 'order_created' && (
                      <div className="text-xs text-muted-foreground">
                        Order #{notification.data.order_number} • TZS {notification.data.total_amount?.toLocaleString()}
                      </div>
                    )}
                    {notification.type === 'order_status_updated' && (
                      <div className="text-xs text-muted-foreground">
                        Status: {notification.data.new_status}
                      </div>
                    )}
                    {notification.type === 'stock_alert' && (
                      <div className="text-xs text-muted-foreground">
                        Product: {notification.data.product_name}
                      </div>
                    )}
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}