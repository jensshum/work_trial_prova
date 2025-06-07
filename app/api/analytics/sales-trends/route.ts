import { NextResponse } from 'next/server'
import { getSalesTrends } from '@/lib/db/analytics'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') as '7d' | '30d' | '90d'
    
    if (!period || !['7d', '30d', '90d'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period parameter' },
        { status: 400 }
      )
    }

    const trends = await getSalesTrends(period)
    return NextResponse.json(trends)
  } catch (error) {
    console.error('Error fetching sales trends:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 