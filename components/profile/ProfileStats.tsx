interface ProfileStatsProps {
  totalCitizens: number
  totalBankBalance: number
  averageAge: number
}

export default function ProfileStats({ totalCitizens, totalBankBalance, averageAge }: ProfileStatsProps) {
  const stats = [
    {
      name: 'Total Citizens',
      value: totalCitizens.toLocaleString(),
      icon: '👥',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Total Bank Balance',
      value: `£${totalBankBalance.toLocaleString()}`,
      icon: '💰',
      color: 'bg-green-100 text-green-600'
    },
    {
      name: 'Average Age',
      value: `${averageAge} years`,
      icon: '📊',
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.color}`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
