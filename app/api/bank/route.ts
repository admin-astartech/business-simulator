import { citizensWithBankData } from '@/data/citizensBankAccount'
import { NextResponse } from 'next/server'

// Calculate total bank balance from all citizens' bank accounts
const totalBankBalance = citizensWithBankData.reduce((sum, citizen) => sum + citizen.bankBalance, 0)

const bankData = {
  totalBalance: totalBankBalance,
  citizensAccounts: citizensWithBankData
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json(bankData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bank data' },
      { status: 500 }
    )
  }
}
