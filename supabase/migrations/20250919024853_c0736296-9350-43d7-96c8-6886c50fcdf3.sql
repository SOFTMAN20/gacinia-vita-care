-- Add expiry functionality to cart_items table
ALTER TABLE cart_items ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days');

-- Create index for efficient cleanup of expired items
CREATE INDEX idx_cart_items_expires_at ON cart_items(expires_at);

-- Create function to clean up expired cart items
CREATE OR REPLACE FUNCTION cleanup_expired_cart_items()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM cart_items WHERE expires_at < NOW();
END;
$$;

-- Create function to extend cart item expiry on activity
CREATE OR REPLACE FUNCTION extend_cart_item_expiry()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Extend expiry by 7 days when cart item is updated
  NEW.expires_at = NOW() + INTERVAL '7 days';
  RETURN NEW;
END;
$$;

-- Create trigger to automatically extend expiry on updates
CREATE TRIGGER extend_cart_expiry_trigger
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION extend_cart_item_expiry();