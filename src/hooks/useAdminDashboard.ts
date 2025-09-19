import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardKPI {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  current_stock: number;
  min_stock_level: number;
  category_name: string;
}

export interface DashboardData {
  totalRevenue: number;
  ordersToday: number;
  activeCustomers: number;
  totalProducts: number;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
}

export const useAdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get today's date for filtering
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      // Fetch all required data in parallel
      const [
        totalRevenueResult,
        ordersTodayResult,
        activeCustomersResult,
        totalProductsResult,
        recentOrdersResult,
        lowStockResult
      ] = await Promise.all([
        // Total revenue from all orders
        supabase
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'paid'),
        
        // Orders today count
        supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayStart.toISOString())
          .lt('created_at', todayEnd.toISOString()),
        
        // Active customers (users who have made orders)
        supabase
          .from('orders')
          .select('user_id', { count: 'exact', head: true }),
        
        // Total products
        supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Recent orders with user profiles
        supabase
          .from('orders')
          .select(`
            id,
            order_number,
            total_amount,
            status,
            created_at,
            profiles!orders_user_id_fkey (
              full_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Low stock products
        supabase
          .from('products')
          .select(`
            id,
            name,
            stock_count,
            min_stock_level,
            categories!products_category_id_fkey (
              name
            )
          `)
          .eq('is_active', true)
          .not('stock_count', 'is', null)
          .not('min_stock_level', 'is', null)
          .filter('stock_count', 'lte', 'min_stock_level')
          .order('stock_count', { ascending: true })
          .limit(10)
      ]);

      // Check for errors
      if (totalRevenueResult.error) throw totalRevenueResult.error;
      if (ordersTodayResult.error) throw ordersTodayResult.error;
      if (activeCustomersResult.error) throw activeCustomersResult.error;
      if (totalProductsResult.error) throw totalProductsResult.error;
      if (recentOrdersResult.error) throw recentOrdersResult.error;
      if (lowStockResult.error) throw lowStockResult.error;

      // Calculate total revenue
      const totalRevenue = totalRevenueResult.data?.reduce(
        (sum, order) => sum + (order.total_amount || 0), 
        0
      ) || 0;

      // Format recent orders
      const recentOrders: RecentOrder[] = recentOrdersResult.data?.map(order => ({
        id: order.id,
        order_number: order.order_number || `ORD-${order.id.slice(-8)}`,
        customer_name: order.profiles?.full_name || 'Unknown Customer',
        total_amount: order.total_amount || 0,
        status: order.status || 'pending',
        created_at: order.created_at
      })) || [];

      // Format low stock products
      const lowStockProducts: LowStockProduct[] = lowStockResult.data?.map(product => ({
        id: product.id,
        name: product.name,
        current_stock: product.stock_count || 0,
        min_stock_level: product.min_stock_level || 5,
        category_name: product.categories?.name || 'Uncategorized'
      })) || [];

      setData({
        totalRevenue,
        ordersToday: ordersTodayResult.count || 0,
        activeCustomers: activeCustomersResult.count || 0,
        totalProducts: totalProductsResult.count || 0,
        recentOrders,
        lowStockProducts
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  };
};