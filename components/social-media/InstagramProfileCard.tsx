import { InstagramProfile } from '@/types/socialMedia'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import CitizenChatModal from '@/components/citizens/CitizenChatModal'
import { Citizen } from '@/types/citizens'
import { getCitizenImage } from '@/lib/citizen'
import Image from 'next/image'

interface InstagramProfileCardProps {
  profile: InstagramProfile
  citizen: Citizen
}

export default function InstagramProfileCard({ profile, citizen }: InstagramProfileCardProps) {
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
            {profile.verified && (
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
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
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="font-semibold text-gray-900">{profile.followers.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">{profile.following.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Following</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900">{profile.postsCount}</p>
            <p className="text-xs text-gray-600">Posts</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Avg Likes:</span>
            <span className="font-medium">{profile.avgLikes.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg Comments:</span>
            <span className="font-medium">{profile.avgComments.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Engagement:</span>
          <span className="font-medium text-purple-600">{profile.engagementRate}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Reels Share:</span>
          <span className="font-medium">{profile.reelsSharePct}%</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Content Themes:</p>
          <div className="flex flex-wrap gap-1">
            {profile.contentThemes.slice(0, 3).map((theme, index) => (
              <span key={index} className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs rounded-full">
                {theme}
              </span>
            ))}
            {profile.contentThemes.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{profile.contentThemes.length - 3} more
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Grid Style:</p>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
            {profile.gridStyle}
          </span>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1">Story Cadence:</p>
          <span className="text-xs text-gray-700">{profile.storyCadence}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <a
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
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
