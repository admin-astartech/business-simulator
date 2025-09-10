import { NextResponse } from 'next/server'
import { citizensData } from '@/data/citizens'

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const totalValue = citizensData.reduce((sum, citizen) => sum + citizen.monetaryValue, 0)
    
    return NextResponse.json({
      totalValue,
      citizensCount: citizensData.length,
      averageValue: Math.round(totalValue / citizensData.length)
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch citizens value data' },
      { status: 500 }
    )
  }
}
