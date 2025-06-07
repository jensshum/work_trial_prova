import { NextResponse } from 'next/server'
import { getOverviewMetrics } from '@/lib/db/analytics'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') || '30d') as '7d' | '30d' | '90d'
    
    if (!['7d', '30d', '90d'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period parameter' },
        { status: 400 }
      )
    }

    const metrics = await getOverviewMetrics(period)
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching overview metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 