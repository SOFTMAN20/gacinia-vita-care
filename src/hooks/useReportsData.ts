import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type DateRange = '7days' | '30days' | '90days' | 'year' | 'all';

interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  aovChange: number;
  completedRevenue: number;
  completedOrders: number;
  pendingRevenue: number;
  pendingOrders: number;
  cancelledRevenue: number;
  cancelledOrders: number;
}

interface ProductMetrics {
  totalProducts: number;
  activeProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  wellStockedProducts: number;
  totalInventoryValue: number;
}

interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  firstTimeBuyers: number;
  customerGrowth: number;
  avgOrdersPerCustomer: number;
  retentionRate: number;
  avgLifetimeValue: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  imageUrl: string | null;
  unitsSold: number;
  revenue: number;
  price: number;
}

interface TopCategory {
  id: string;
  name: string;
  productCount: number;
  revenue: number;
  orders: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: string;
  date: string;
}

export function useReportsData(dateRange: DateRange) {
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    revenueChange: 0,
    ordersChange: 0,
    aovChange: 0,
    completedRevenue: 0,
    completedOrders: 0,
    pendingRevenue: 0,
    pendingOrders: 0,
    cancelledRevenue: 0,
    cancelledOrders: 0,
  });

  const [productMetrics, setProductMetrics] = useState<ProductMetrics>({
    totalProducts: 0,
    activeProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    wellStockedProducts: 0,
    totalInventoryValue: 0,
  });

  const [customerMetrics, setCustomerMetrics] = useState<CustomerMetrics>({
    totalCustomers: 0,
    activeCustomers: 0,
    newCustomers: 0,
    repeatCustomers: 0,
    firstTimeBuyers: 0,
    customerGrowth: 0,
    avgOrdersPerCustomer: 0,
    retentionRate: 0,
    avgLifetimeValue: 0,
  });

  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const getDateFilter = (range: DateRange): Date | null => {
    const now = new Date();
    switch (range) {
      case '7days':
        return new Date(now.setDate(now.getDate() - 7));
      case '30days':
        return new Date(now.setDate(now.getDate() - 30));
      case '90days':
        return new Date(now.setDate(now.getDate() - 90));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      case 'all':
        return null;
      default:
        return new Date(now.setDate(now.getDate() - 30));
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSalesMetrics(),
        fetchProductMetrics(),
        fetchCustomerMetrics(),
        fetchTopProducts(),
        fetchTopCategories(),
        fetchRecentOrders(),
      ]);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesMetrics = async () => {
    try {
      const dateFilter = getDateFilter(dateRange);
      
      // Fetch current period orders
      let currentQuery = supabase
        .from('orders')
        .select('total_amount, status, created_at');
      
      if (dateFilter) {
        currentQuery = currentQuery.gte('created_at', dateFilter.toISOString());
      }
      
      const { data: currentOrders, error } = await currentQuery;
      
      if (error) throw error;

      // Calculate current period metrics
      const totalRevenue = currentOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalOrders = currentOrders?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate by status
      const completedOrders = currentOrders?.filter(o => o.status === 'delivered') || [];
      const pendingOrders = currentOrders?.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)) || [];
      const cancelledOrders = currentOrders?.filter(o => o.status === 'cancelled') || [];

      const completedRevenue = completedOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const pendingRevenue = pendingOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const cancelledRevenue = cancelledOrders.reduce((sum, order) => sum + order.total_amount, 0);

      // Fetch previous period for comparison
      let previousPeriodStart: Date | null = null;
      if (dateFilter) {
        const daysDiff = Math.floor((new Date().getTime() - dateFilter.getTime()) / (1000 * 60 * 60 * 24));
        previousPeriodStart = new Date(dateFilter);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - daysDiff);
      }

      let previousQuery = supabase
        .from('orders')
        .select('total_amount, created_at');
      
      if (previousPeriodStart && dateFilter) {
        previousQuery = previousQuery
          .gte('created_at', previousPeriodStart.toISOString())
          .lt('created_at', dateFilter.toISOString());
      }

      const { data: previousOrders } = await previousQuery;

      const previousRevenue = previousOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const previousOrderCount = previousOrders?.length || 0;
      const previousAOV = previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0;

      // Calculate percentage changes
      const revenueChange = previousRevenue > 0 
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;
      const ordersChange = previousOrderCount > 0 
        ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100 
        : 0;
      const aovChange = previousAOV > 0 
        ? ((averageOrderValue - previousAOV) / previousAOV) * 100 
        : 0;

      setSalesMetrics({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueChange,
        ordersChange,
        aovChange,
        completedRevenue,
        completedOrders: completedOrders.length,
        pendingRevenue,
        pendingOrders: pendingOrders.length,
        cancelledRevenue,
        cancelledOrders: cancelledOrders.length,
      });
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
    }
  };

  const fetchProductMetrics = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, is_active, stock_count, min_stock_level, price');

      if (error) throw error;

      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter(p => p.is_active).length || 0;
      const inStockProducts = products?.filter(p => p.stock_count > 0).length || 0;
      const outOfStockProducts = products?.filter(p => p.stock_count === 0).length || 0;
      const lowStockProducts = products?.filter(p => 
        p.stock_count > 0 && p.stock_count <= p.min_stock_level
      ).length || 0;
      const wellStockedProducts = products?.filter(p => 
        p.stock_count > p.min_stock_level
      ).length || 0;
      const totalInventoryValue = products?.reduce((sum, p) => 
        sum + (p.price * p.stock_count), 0
      ) || 0;

      setProductMetrics({
        totalProducts,
        activeProducts,
        inStockProducts,
        outOfStockProducts,
        lowStockProducts,
        wellStockedProducts,
        totalInventoryValue,
      });
    } catch (error) {
      console.error('Error fetching product metrics:', error);
    }
  };

  const fetchCustomerMetrics = async () => {
    try {
      const dateFilter = getDateFilter(dateRange);

      // Fetch all customers
      const { data: allCustomers, error: customersError } = await supabase
        .from('profiles')
        .select('id, created_at');

      if (customersError) throw customersError;

      const totalCustomers = allCustomers?.length || 0;

      // Fetch orders with customer info
      let ordersQuery = supabase
        .from('orders')
        .select('user_id, total_amount, created_at');
      
      if (dateFilter) {
        ordersQuery = ordersQuery.gte('created_at', dateFilter.toISOString());
      }

      const { data: orders, error: ordersError } = await ordersQuery;
      
      if (ordersError) throw ordersError;

      // Calculate active customers (those who placed orders in period)
      const activeCustomerIds = new Set(orders?.map(o => o.user_id) || []);
      const activeCustomers = activeCustomerIds.size;

      // Calculate new customers in period
      const newCustomers = dateFilter 
        ? allCustomers?.filter(c => c.created_at && new Date(c.created_at) >= dateFilter).length || 0
        : 0;

      // Calculate customer order frequency
      const customerOrderCounts = new Map<string, number>();
      orders?.forEach(order => {
        const count = customerOrderCounts.get(order.user_id) || 0;
        customerOrderCounts.set(order.user_id, count + 1);
      });

      const repeatCustomers = Array.from(customerOrderCounts.values()).filter(count => count > 1).length;
      const firstTimeBuyers = Array.from(customerOrderCounts.values()).filter(count => count === 1).length;
      const avgOrdersPerCustomer = activeCustomers > 0 
        ? (orders?.length || 0) / activeCustomers 
        : 0;

      // Calculate retention rate
      const retentionRate = totalCustomers > 0 
        ? (repeatCustomers / totalCustomers) * 100 
        : 0;

      // Calculate average lifetime value
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const avgLifetimeValue = activeCustomers > 0 
        ? totalRevenue / activeCustomers 
        : 0;

      // Calculate customer growth
      const previousPeriodCustomers = dateFilter
        ? allCustomers?.filter(c => c.created_at && new Date(c.created_at) < dateFilter).length || 0
        : totalCustomers;
      
      const customerGrowth = previousPeriodCustomers > 0
        ? ((totalCustomers - previousPeriodCustomers) / previousPeriodCustomers) * 100
        : 0;

      setCustomerMetrics({
        totalCustomers,
        activeCustomers,
        newCustomers,
        repeatCustomers,
        firstTimeBuyers,
        customerGrowth,
        avgOrdersPerCustomer,
        retentionRate,
        avgLifetimeValue,
      });
    } catch (error) {
      console.error('Error fetching customer metrics:', error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const dateFilter = getDateFilter(dateRange);

      let query = supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          unit_price,
          total_price,
          products (
            id,
            name,
            image_url,
            categories (name)
          ),
          orders!inner (created_at)
        `);

      if (dateFilter) {
        query = query.gte('orders.created_at', dateFilter.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Aggregate by product
      const productMap = new Map<string, {
        id: string;
        name: string;
        category: string;
        imageUrl: string | null;
        unitsSold: number;
        revenue: number;
        price: number;
      }>();

      data?.forEach(item => {
        const product = item.products;
        if (!product) return;

        const existing = productMap.get(product.id);
        if (existing) {
          existing.unitsSold += item.quantity;
          existing.revenue += item.total_price;
        } else {
          productMap.set(product.id, {
            id: product.id,
            name: product.name,
            category: product.categories?.name || 'Uncategorized',
            imageUrl: product.image_url,
            unitsSold: item.quantity,
            revenue: item.total_price,
            price: item.unit_price,
          });
        }
      });

      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      setTopProducts(topProducts);
    } catch (error) {
      console.error('Error fetching top products:', error);
    }
  };

  const fetchTopCategories = async () => {
    try {
      const dateFilter = getDateFilter(dateRange);

      let query = supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          unit_price,
          total_price,
          products!inner (
            category_id,
            categories (id, name)
          ),
          orders!inner (id, created_at)
        `);

      if (dateFilter) {
        query = query.gte('orders.created_at', dateFilter.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Aggregate by category
      const categoryMap = new Map<string, {
        id: string;
        name: string;
        productCount: Set<string>;
        revenue: number;
        orders: Set<string>;
      }>();

      data?.forEach(item => {
        const category = item.products?.categories;
        if (!category) return;

        const existing = categoryMap.get(category.id);
        if (existing) {
          existing.productCount.add(item.product_id);
          existing.revenue += item.total_price;
          existing.orders.add(item.orders.id);
        } else {
          categoryMap.set(category.id, {
            id: category.id,
            name: category.name,
            productCount: new Set([item.product_id]),
            revenue: item.total_price,
            orders: new Set([item.orders.id]),
          });
        }
      });

      const topCategories = Array.from(categoryMap.values())
        .map(cat => ({
          id: cat.id,
          name: cat.name,
          productCount: cat.productCount.size,
          revenue: cat.revenue,
          orders: cat.orders.size,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      setTopCategories(topCategories);
    } catch (error) {
      console.error('Error fetching top categories:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          profiles (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const recentOrders = data?.map(order => ({
        id: order.id,
        orderNumber: order.order_number || `ORD-${order.id.slice(-8)}`,
        customerName: order.profiles?.full_name || 'Unknown Customer',
        amount: order.total_amount,
        status: order.status,
        date: order.created_at,
      })) || [];

      setRecentOrders(recentOrders);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };

  return {
    salesMetrics,
    productMetrics,
    customerMetrics,
    topProducts,
    topCategories,
    recentOrders,
    loading,
  };
}
