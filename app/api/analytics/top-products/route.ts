import { NextResponse } from 'next/server'
import { getTopProducts } from '@/lib/db/analytics'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') || '30d') as '7d' | '30d' | '90d'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!['7d', '30d', '90d'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period parameter' },
        { status: 400 }
      )
    }

    if (isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid limit parameter' },
        { status: 400 }
      )
    }

    const products = await getTopProducts(limit, period)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching top products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 