-- Create stock_movements table to track all inventory movements
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity integer NOT NULL,
  reason text NOT NULL,
  reference text,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Create policies for stock_movements
CREATE POLICY "Admins can view all stock movements"
  ON public.stock_movements
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert stock movements"
  ON public.stock_movements
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert stock movements"
  ON public.stock_movements
  FOR INSERT
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON public.stock_movements(created_at DESC);

-- Create function to log stock movements from order items
CREATE OR REPLACE FUNCTION public.log_stock_movement_from_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  order_number_val text;
BEGIN
  -- Get the order number
  SELECT order_number INTO order_number_val
  FROM orders
  WHERE id = NEW.order_id;

  -- Log the stock movement
  INSERT INTO public.stock_movements (
    product_id,
    type,
    quantity,
    reason,
    reference,
    user_id
  ) VALUES (
    NEW.product_id,
    'out',
    -ABS(NEW.quantity),
    'Sale to customer',
    order_number_val,
    (SELECT user_id FROM orders WHERE id = NEW.order_id)
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error logging stock movement: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger to auto-log stock movements when order items are created
CREATE TRIGGER trigger_log_stock_movement_from_order
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.log_stock_movement_from_order();

-- Enable realtime for stock_movements
ALTER TABLE public.stock_movements REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_movements;