import { TikTokProfile } from '@/types/socialMedia'
import { Citizen } from '@/types/citizens'
import TikTokProfileCard from './TikTokProfileCard'

interface TikTokAccountsSectionProps {
  profiles: TikTokProfile[]
  citizens: Citizen[]
}

export default function TikTokAccountsSection({ profiles, citizens }: TikTokAccountsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Citizen TikTok Accounts</h3>
            <p className="text-gray-600">TikTok profiles of citizens with social media data</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{profiles.length}</p>
            <p className="text-sm text-gray-600">Active Profiles</p>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => {
          const citizen = citizens.find(c => c.id === profile.id)
          return (
            <TikTokProfileCard 
              key={profile.id} 
              profile={profile} 
              citizen={citizen}
            />
          )
        })}
      </div>
    </div>
  )
}
