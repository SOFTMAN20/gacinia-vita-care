import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

interface SalesMetric {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface ProductPerformance {
  id: string;
  name: string;
  revenue: number;
  quantity_sold: number;
  profit_margin: number;
}

interface CategoryPerformance {
  category: string;
  revenue: number;
  orders: number;
  products_sold: number;
}

interface PaymentMethodStats {
  method: string;
  count: number;
  total_amount: number;
}

interface ReportsData {
  salesMetrics: SalesMetric[];
  topProducts: ProductPerformance[];
  categoryPerformance: CategoryPerformance[];
  paymentMethods: PaymentMethodStats[];
  inventoryAlerts: {
    low_stock: number;
    expiring_soon: number;
    out_of_stock: number;
  };
  customerStats: {
    total_customers: number;
    new_this_month: number;
    repeat_customers: number;
    retention_rate: number;
  };
}

export const useReportsData = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ['reports', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: async (): Promise<ReportsData> => {
      const start = format(startDate, 'yyyy-MM-dd');
      const end = format(endDate, 'yyyy-MM-dd');

      // Fetch sales metrics over time
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('created_at, total_amount, user_id, payment_status')
        .gte('created_at', start)
        .lte('created_at', end)
        .eq('payment_status', 'paid');

      if (ordersError) throw ordersError;

      // Group orders by date
      const salesByDate = (ordersData || []).reduce((acc, order) => {
        const date = format(new Date(order.created_at), 'yyyy-MM-dd');
        if (!acc[date]) {
          acc[date] = { revenue: 0, orders: 0, customers: new Set() };
        }
        acc[date].revenue += Number(order.total_amount);
        acc[date].orders += 1;
        acc[date].customers.add(order.user_id);
        return acc;
      }, {} as Record<string, { revenue: number; orders: number; customers: Set<string> }>);

      const salesMetrics: SalesMetric[] = Object.entries(salesByDate).map(([date, stats]) => ({
        date,
        revenue: stats.revenue,
        orders: stats.orders,
        customers: stats.customers.size,
      })).sort((a, b) => a.date.localeCompare(b.date));

      // Fetch top products
      const { data: topProductsData, error: topProductsError } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          unit_price,
          total_price,
          products!inner(name, price, original_price)
        `)
        .gte('created_at', start)
        .lte('created_at', end);

      if (topProductsError) throw topProductsError;

      const productStats = (topProductsData || []).reduce((acc, item: any) => {
        const productId = item.product_id;
        if (!acc[productId]) {
          acc[productId] = {
            id: productId,
            name: item.products.name,
            revenue: 0,
            quantity_sold: 0,
            profit_margin: 0,
          };
        }
        acc[productId].revenue += Number(item.total_price);
        acc[productId].quantity_sold += item.quantity;
        return acc;
      }, {} as Record<string, ProductPerformance>);

      const topProducts = Object.values(productStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Fetch category performance
      const { data: categoryData, error: categoryError } = await supabase
        .from('order_items')
        .select(`
          quantity,
          total_price,
          products!inner(
            category_id,
            categories!inner(name)
          )
        `)
        .gte('created_at', start)
        .lte('created_at', end);

      if (categoryError) throw categoryError;

      const categoryStats = (categoryData || []).reduce((acc, item: any) => {
        const categoryName = item.products?.categories?.name || 'Uncategorized';
        if (!acc[categoryName]) {
          acc[categoryName] = { category: categoryName, revenue: 0, orders: 0, products_sold: 0 };
        }
        acc[categoryName].revenue += Number(item.total_price);
        acc[categoryName].orders += 1;
        acc[categoryName].products_sold += item.quantity;
        return acc;
      }, {} as Record<string, CategoryPerformance>);

      const categoryPerformance = Object.values(categoryStats)
        .sort((a, b) => b.revenue - a.revenue);

      // Fetch payment methods stats
      const { data: paymentData, error: paymentError } = await supabase
        .from('orders')
        .select('payment_method, total_amount')
        .gte('created_at', start)
        .lte('created_at', end)
        .eq('payment_status', 'paid');

      if (paymentError) throw paymentError;

      const paymentStats = (paymentData || []).reduce((acc, order) => {
        const method = order.payment_method || 'Not specified';
        if (!acc[method]) {
          acc[method] = { method, count: 0, total_amount: 0 };
        }
        acc[method].count += 1;
        acc[method].total_amount += Number(order.total_amount);
        return acc;
      }, {} as Record<string, PaymentMethodStats>);

      const paymentMethods = Object.values(paymentStats);

      // Fetch inventory alerts
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('stock_count, min_stock_level, expiry_date');

      if (productsError) throw productsError;

      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      const inventoryAlerts = {
        low_stock: (productsData || []).filter(p => 
          p.stock_count > 0 && p.stock_count <= (p.min_stock_level || 5)
        ).length,
        expiring_soon: (productsData || []).filter(p => 
          p.expiry_date && new Date(p.expiry_date) <= thirtyDaysFromNow
        ).length,
        out_of_stock: (productsData || []).filter(p => p.stock_count === 0).length,
      };

      // Fetch customer stats
      const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const { data: allCustomers, error: customersError } = await supabase
        .from('profiles')
        .select('id, created_at')
        .eq('role', 'customer');

      if (customersError) throw customersError;

      const newThisMonth = (allCustomers || []).filter(c => 
        c.created_at >= monthStart
      ).length;

      // Calculate repeat customers (customers with more than 1 order)
      const { data: customerOrders, error: customerOrdersError } = await supabase
        .from('orders')
        .select('user_id');

      if (customerOrdersError) throw customerOrdersError;

      const orderCounts = (customerOrders || []).reduce((acc, order) => {
        acc[order.user_id] = (acc[order.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const repeatCustomers = Object.values(orderCounts).filter(count => count > 1).length;
      const totalCustomers = allCustomers?.length || 0;
      const retentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

      const customerStats = {
        total_customers: totalCustomers,
        new_this_month: newThisMonth,
        repeat_customers: repeatCustomers,
        retention_rate: Math.round(retentionRate * 10) / 10,
      };

      return {
        salesMetrics,
        topProducts,
        categoryPerformance,
        paymentMethods,
        inventoryAlerts,
        customerStats,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
