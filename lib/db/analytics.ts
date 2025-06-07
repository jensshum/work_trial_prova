import { prisma } from './client'

export async function getOverviewMetrics(period: '7d' | '30d' | '90d') {
  const days = parseInt(period)
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const orders = await prisma.order.findMany({
    where: {
      orderDate: {
        gte: startDate
      }
    },
    include: {
      product: true
    }
  })

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalOrders = orders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return {
    total_revenue: totalRevenue,
    total_orders: totalOrders,
    average_order_value: averageOrderValue,
    period
  }
}

export async function getSalesTrends(period: '7d' | '30d' | '90d') {
  const days = parseInt(period)
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const orders = await prisma.order.findMany({
    where: {
      orderDate: {
        gte: startDate
      }
    },
    include: {
      product: true
    }
  })

  // Group orders by date
  const dailyData = orders.reduce((acc, order) => {
    const date = order.orderDate.toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { revenue: 0, orders: 0 }
    }
    acc[date].revenue += order.totalAmount
    acc[date].orders += 1
    return acc
  }, {} as Record<string, { revenue: number; orders: number }>)

  const data = Object.entries(dailyData).map(([date, stats]) => ({
    date,
    revenue: stats.revenue,
    orders: stats.orders
  }))

  return {
    data,
    period
  }
}

export async function getTopProducts(limit: number = 10, period: '7d' | '30d' | '90d') {
  const days = parseInt(period)
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const orders = await prisma.order.findMany({
    where: {
      orderDate: {
        gte: startDate
      }
    },
    include: {
      product: true
    }
  })

  // Group orders by product
  const productStats = orders.reduce((acc, order) => {
    const product = order.product
    if (!acc[product.id]) {
      acc[product.id] = {
        id: product.id,
        name: product.name,
        category: product.category,
        total_revenue: 0,
        units_sold: 0
      }
    }
    acc[product.id].total_revenue += order.totalAmount
    acc[product.id].units_sold += order.quantity
    return acc
  }, {} as Record<number, {
    id: number
    name: string
    category: string
    total_revenue: number
    units_sold: number
  }>)

  // Calculate growth rate (simplified for demo)
  const products = Object.values(productStats).map(product => ({
    ...product,
    growth_rate: 15.5 // Simplified for demo
  }))

  // Sort by revenue and limit
  return {
    products: products
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, limit),
    period
  }
}

export async function simulateOrder(productId: number, quantity: number, totalAmount: number) {
  const order = await prisma.order.create({
    data: {
      productId,
      quantity,
      totalAmount,
      status: 'completed'
    },
    include: {
      product: true
    }
  })

  return {
    id: order.id,
    status: order.status,
    order_date: order.orderDate
  }
} 