import { Citizen } from '@/types/citizens'
import { Mars, Venus } from 'lucide-react'

interface CitizensStatsProps {
  totalCitizens: number
  citizens: Citizen[]
}

export default function CitizensStats({ totalCitizens, citizens }: CitizensStatsProps) {
  const onlineCitizens = citizens.filter(citizen => citizen.isOnline).length
  const offlineCitizens = totalCitizens - onlineCitizens
  const onlinePercentage = totalCitizens > 0 ? Math.round((onlineCitizens / totalCitizens) * 100) : 0

  // Gender statistics
  const maleCitizens = citizens.filter(citizen => citizen.gender === 'male').length
  const femaleCitizens = citizens.filter(citizen => citizen.gender === 'female').length

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Total Citizens */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Citizens</p>
              <p className="text-2xl font-bold text-gray-900">{totalCitizens}</p>
            </div>
          </div>
        </div>

        {/* Online Citizens */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <span className="text-2xl">🟢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Online</p>
              <p className="text-2xl font-bold text-green-600">{onlineCitizens}</p>
              <p className="text-xs text-gray-500">{onlinePercentage}% of total</p>
            </div>
          </div>
        </div>

        {/* Offline Citizens */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 text-gray-600">
              <span className="text-2xl">⚫</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-600">{offlineCitizens}</p>
              <p className="text-xs text-gray-500">{100 - onlinePercentage}% of total</p>
            </div>
          </div>
        </div>

        {/* Male Citizens */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Mars className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Male</p>
              <p className="text-2xl font-bold text-blue-600">{maleCitizens}</p>
              <p className="text-xs text-gray-500">{totalCitizens > 0 ? Math.round((maleCitizens / totalCitizens) * 100) : 0}% of total</p>
            </div>
          </div>
        </div>

        {/* Female Citizens */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100 text-pink-600">
              <Venus className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Female</p>
              <p className="text-2xl font-bold text-pink-600">{femaleCitizens}</p>
              <p className="text-xs text-gray-500">{totalCitizens > 0 ? Math.round((femaleCitizens / totalCitizens) * 100) : 0}% of total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
