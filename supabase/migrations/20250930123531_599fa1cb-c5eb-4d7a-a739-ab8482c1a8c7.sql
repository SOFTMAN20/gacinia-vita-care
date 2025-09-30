-- Enable realtime for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Create a function to notify admins about order status changes
CREATE OR REPLACE FUNCTION notify_admins_order_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record RECORD;
  order_status_text TEXT;
BEGIN
  -- Only proceed if status changed (for UPDATE) or for new orders (INSERT)
  IF (TG_OP = 'UPDATE' AND NEW.status = OLD.status) THEN
    RETURN NEW;
  END IF;

  -- Format status for display
  order_status_text := REPLACE(REPLACE(NEW.status::text, '_', ' '), 'order_status', '');
  order_status_text := INITCAP(order_status_text);

  -- For order status updates (not new orders)
  IF (TG_OP = 'UPDATE' AND NEW.status != OLD.status) THEN
    -- Send notification to all admins
    FOR admin_record IN 
      SELECT id FROM profiles WHERE role = 'admin'
    LOOP
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        data,
        is_read,
        created_at
      ) VALUES (
        admin_record.id,
        'order_status_admin',
        'Order Status Updated',
        'Order #' || NEW.order_number || ' status changed to ' || order_status_text,
        jsonb_build_object(
          'order_id', NEW.id,
          'order_number', NEW.order_number,
          'old_status', OLD.status,
          'new_status', NEW.status,
          'total_amount', NEW.total_amount
        ),
        false,
        NOW()
      );
    END LOOP;
    
    RAISE LOG 'Admin notifications created for order status change: % -> %', OLD.status, NEW.status;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in notify_admins_order_change: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for order status changes
DROP TRIGGER IF EXISTS trigger_notify_admins_order_change ON orders;
CREATE TRIGGER trigger_notify_admins_order_change
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_admins_order_change();

-- Add notification on order table to supabase_realtime publication if not already added
DO $$
BEGIN
  -- Check if notifications table is in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;