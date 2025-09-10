'use client'

import { useBank } from '@/hooks/useBank'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import CitizensBankTable from '@/components/bank/CitizensBankTable'

export default function Bank() {
  const { data, loading, error } = useBank()

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <LoadingSpinner message="Loading bank data..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage message={error} />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage message="No bank data available" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader />
        <div className="mb-8">
          <BankStats totalBalance={data.totalBalance} />
        </div>
        <CitizensBankTable citizensAccounts={data.citizensAccounts} />
      </div>
    </div>
  )
}

function PageHeader() {
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Bank Management
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your business finances and track transactions.
      </p>
    </>
  )
}

interface BankStatsProps {
  totalBalance: number
}

function BankStats({ totalBalance }: BankStatsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <span className="text-2xl">💰</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total Bank Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            £{totalBalance.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            (Sum of all citizens' bank accounts)
          </p>
        </div>
      </div>
    </div>
  )
}


