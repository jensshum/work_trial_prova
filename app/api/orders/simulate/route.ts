import { NextResponse } from 'next/server'
import { simulateOrder } from '@/lib/db/analytics'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product_id, quantity, total_amount } = body

    if (!product_id || !quantity || !total_amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const order = await simulateOrder(product_id, quantity, total_amount)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error simulating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 