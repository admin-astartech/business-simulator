import { TikTokProfile } from '@/types/socialMedia'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import CitizenChatModal from '@/components/citizens/CitizenChatModal'
import { Citizen } from '@/types/citizens'
import { getCitizenImage } from '@/lib/citizen'
import Image from 'next/image'

interface TikTokProfileCardProps {
  profile: TikTokProfile
  citizen: Citizen
}

export default function TikTokProfileCard({ profile, citizen }: TikTokProfileCardProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

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
          <Image src={getCitizenImage(profile.name, citizen?.gender)} alt={profile.name} width={48} height={48} />
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
          <p className="text-sm text-gray-600 truncate">@{profile.handle}</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{profile.bio}</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Followers:</span>
            <span className="font-medium">{profile.followers.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Following:</span>
            <span className="font-medium">{profile.following.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Posts:</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Likes:</span>
            <span className="font-medium">{profile.totalLikes.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Engagement:</span>
          <span className="font-medium text-pink-600">{profile.engagementRate}%</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-600 mb-1">Content Topics:</p>
          <div className="flex flex-wrap gap-1">
            {profile.topics.slice(0, 3).map((topic, index) => (
              <span key={index} className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                {topic}
              </span>
            ))}
            {profile.topics.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{profile.topics.length - 3} more
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Content Style:</p>
          <div className="flex flex-wrap gap-1">
            {profile.contentStyle.slice(0, 2).map((style, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {style}
              </span>
            ))}
            {profile.contentStyle.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{profile.contentStyle.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <a
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-800 text-sm font-medium flex items-center"
          >
            View Profile
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            onClick={() => handleMessage(profile.id)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </button>
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
