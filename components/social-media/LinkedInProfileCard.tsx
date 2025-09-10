import { LinkedInProfile } from '@/types/socialMedia'
import { UserPlus, MessageCircle, UserCheck } from 'lucide-react'
import { useState } from 'react'
import CitizenChatModal from '@/components/citizens/CitizenChatModal'
import { Citizen } from '@/types/citizens'
import { getCitizenImage } from '@/lib/citizen'
import Image from 'next/image'

interface LinkedInProfileCardProps {
  profile: LinkedInProfile
  citizen: Citizen
}

export default function LinkedInProfileCard({ profile, citizen }: LinkedInProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleFollow = (profileId: string) => {
    // TODO: Implement follow functionality
    console.log('Follow profile:', profileId)
    setIsFollowing(!isFollowing)
    // You can add API call here to follow/unfollow the user
  }

  const handleMessage = (profileId: string) => {
    if (citizen) {
      console.log('Opening chat with citizen:', citizen.name)
      setIsChatOpen(true)
    } else {
      console.log('No citizen data available for profile:', profileId)
    }
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Image src={getCitizenImage(profile.name, citizen.gender)} alt={profile.name} width={48} height={48} />
          {/* Online status indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            profile.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-semibold text-gray-900 truncate">{profile.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              profile.isOnline 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {profile.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">{profile.headline}</p>
          <p className="text-xs text-gray-500 mt-1">{profile.location}</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Connections:</span>
          <span className="font-medium">{profile.connections.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Followers:</span>
          <span className="font-medium">{profile.followers.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Experience:</span>
          <span className="font-medium">{profile.experience} years</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-1">
          {profile.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {skill}
            </span>
          ))}
          {profile.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{profile.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-end">
          <div className="flex space-x-2">
            <button
              onClick={() => handleFollow(profile.id)}
              className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isFollowing
                  ? 'text-green-600 bg-green-50 hover:bg-green-100'
                  : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 mr-1" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Follow
                </>
              )}
            </button>
            <button
              onClick={() => handleMessage(profile.id)}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {citizen && (
        <CitizenChatModal
          open={isChatOpen}
          onClose={handleCloseChat}
          citizen={citizen}
        />
      )}
    </div>
  )
}
