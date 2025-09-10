import { LinkedInProfile } from '@/types/socialMedia'
import { Citizen } from '@/types/citizens'
import LinkedInProfileCard from './LinkedInProfileCard'

interface LinkedInAccountsSectionProps {
  profiles: LinkedInProfile[]
  citizens: Citizen[]
}

export default function LinkedInAccountsSection({ profiles, citizens }: LinkedInAccountsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Citizen LinkedIn Accounts</h3>
            <p className="text-gray-600">Professional profiles of citizens with LinkedIn data</p>
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
          if (!citizen) {
            return null
          }
          return (
            <LinkedInProfileCard 
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
