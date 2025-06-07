export interface OverviewMetrics {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  period: string;
}

export interface SalesTrendData {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  period: string;
}

export interface TopProduct {
  id: number;
  name: string;
  total_revenue: number;
  units_sold: number;
  growth_rate: number;
  category: string;
}

export interface TopProductsData {
  products: TopProduct[];
  period: string;
}

export interface Order {
  id: number;
  customer_name: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  order_date: string;
  category: string;
}

export interface OrdersData {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  total_revenue: number;
  units_sold: number;
  growth_rate: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_date: string;
}

export interface ProductsData {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface SimulateOrderRequest {
  product_id: number;
  quantity: number;
  total_amount: number;
}

export interface SimulateOrderResponse {
  id: number;
  status: string;
  order_date: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://trendmartai.netlify.app/api';

export const api = {
  async getOverview(period: '7d' | '30d' | '90d' = '30d'): Promise<OverviewMetrics> {
    const response = await fetch(`${API_BASE}/analytics/overview?period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch overview metrics');
    return response.json();
  },

  async getSalesTrends(period: '7d' | '30d' | '90d'): Promise<SalesTrendData> {
    const response = await fetch(`${API_BASE}/analytics/sales-trends?period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch sales trends');
    return response.json();
  },

  async getTopProducts(limit: number = 10, period: '7d' | '30d' | '90d' = '30d'): Promise<TopProductsData> {
    const response = await fetch(`${API_BASE}/analytics/top-products?limit=${limit}&period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch top products');
    return response.json();
  },

  async getOrders(params: {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    status?: string;
  } = {}): Promise<OrdersData> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    const response = await fetch(`${API_BASE}/orders?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    category?: string;
    status?: string;
  } = {}): Promise<ProductsData> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    const response = await fetch(`${API_BASE}/products?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async simulateOrder(order: SimulateOrderRequest): Promise<SimulateOrderResponse> {
    const response = await fetch(`${API_BASE}/orders/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to simulate order');
    return response.json();
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  },
};