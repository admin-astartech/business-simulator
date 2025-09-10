import { CitizenBankAccount } from "@/types/citizens"
import DataTable, { TableColumn } from '@/components/ui/DataTable'
import { getCitizenImage } from '@/lib/citizen'
import Image from 'next/image'

interface CitizensBankTableProps {
  citizensAccounts: CitizenBankAccount[]
  onAccountSelect?: (account: CitizenBankAccount) => void
}

export default function CitizensBankTable({ citizensAccounts, onAccountSelect }: CitizensBankTableProps) {
  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case 'checking':
        return 'bg-blue-100 text-blue-800'
      case 'savings':
        return 'bg-green-100 text-green-800'
      case 'business':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return '💳'
      case 'savings':
        return '🏦'
      case 'business':
        return '🏢'
      default:
        return '💰'
    }
  }

  const columns: TableColumn<CitizenBankAccount>[] = [
    {
      key: 'citizen',
      header: 'Citizen',
      render: (account) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className={`h-10 w-10 rounded-full ${account.avatarColor} flex items-center justify-center`}>
              <Image src={getCitizenImage(account.name, account.gender)} alt={account.name} width={40} height={40} />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{account.name}</div>
            <div className="text-sm text-gray-500">{account.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'age',
      header: 'Age',
      render: (account) => account.age
    },
    {
      key: 'gender',
      header: 'Gender',
      render: (account) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          account.gender === 'male' 
            ? 'bg-blue-100 text-blue-800' 
            : account.gender === 'female'
            ? 'bg-pink-100 text-pink-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {account.gender || 'Unknown'}
        </span>
      )
    },
    {
      key: 'accountType',
      header: 'Account Type',
      render: (account) => (
        <div className="flex items-center">
          <span className="text-lg mr-2">{getAccountTypeIcon(account.accountType)}</span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeBadge(account.accountType)}`}>
            {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
          </span>
        </div>
      )
    },
    {
      key: 'bankBalance',
      header: 'Bank Balance',
      render: (account) => (
        <span className="text-sm font-medium text-gray-900">
          £{account.bankBalance.toLocaleString()}
        </span>
      )
    },
    {
      key: 'lastTransaction',
      header: 'Last Transaction',
      render: (account) => (
        <span className="text-sm text-gray-500">
          {account.lastTransaction}
        </span>
      )
    }
  ]

  return (
    <DataTable
      data={citizensAccounts}
      columns={columns}
      onRowClick={onAccountSelect}
      title="Citizens Bank Accounts"
      emptyMessage="No bank accounts found"
    />
  )
}
