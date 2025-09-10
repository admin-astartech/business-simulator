import { useState } from 'react'
import Image from 'next/image'
import { useEngagementLog, EngagementLog } from '@/hooks/useEngagementLog'
import { getCitizenImage } from '@/lib/citizen'
import { Heart, MessageCircle, Calendar, User, RefreshCw } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Button from '@/components/buttons/button'

interface ActivityTabProps {
  platform: string
}

export default function ActivityTab({ platform }: ActivityTabProps) {
  const [timeRange, setTimeRange] = useState('7d')
  const { engagements, citizens, loading, error, refetch, totalCount } = useEngagementLog(platform, 100)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getEngagementIcon = (type: string) => {
    return type === 'like' ? (
      <Heart className="h-4 w-4 text-red-500" />
    ) : (
      <MessageCircle className="h-4 w-4 text-blue-500" />
    )
  }

  const getEngagementTypeColor = (type: string) => {
    return type === 'like' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-blue-100 text-blue-800'
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <ErrorMessage 
          message={error}
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Engagement Activity
          </h3>
          <p className="text-sm text-gray-600">
            {totalCount} total engagements on {platform}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <Button
            onClick={refetch}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">
                {engagements.filter(e => e.engagementType === 'like').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900">
                {engagements.filter(e => e.engagementType === 'comment').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <User className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Citizens</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(engagements.map(e => e.citizenId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Recent Activity</h4>
        </div>
        
        {engagements.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 mb-2">
              <Heart className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">No engagement activity found</p>
            <p className="text-sm text-gray-400">Engagements will appear here as citizens interact with your posts</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {engagements.map((engagement) => {
              // Try to find citizen by ID first
              let citizen = citizens.get(engagement.citizenId)
              
              // If not found by ID, try to find by name as fallback
              if (!citizen) {
                citizen = Array.from(citizens.values()).find(c => 
                  c.name.toLowerCase() === engagement.citizenName.toLowerCase()
                )
              }
              
              return (
                <div key={engagement._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center space-x-3">
                        {/* Citizen Avatar */}
                        <div className={`h-10 w-10 rounded-full ${citizen?.avatarColor || 'bg-gray-300'} flex items-center justify-center`}>
                          {citizen ? (
                            <Image
                              src={getCitizenImage(citizen.name, citizen.gender)}
                              alt={citizen.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {engagement.citizenName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        {/* Engagement Icon */}
                        <div className="flex-shrink-0">
                          {getEngagementIcon(engagement.engagementType)}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {engagement.citizenName}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEngagementTypeColor(engagement.engagementType)}`}>
                            {engagement.engagementType}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatTimestamp(engagement.timestamp)}
                        </div>
                      </div>
                    
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Reason:</span> {engagement.engagementReason}
                        </p>
                        
                        {engagement.postContent && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Post Content:</p>
                            <p className="text-sm text-gray-700">
                              {truncateContent(engagement.postContent)}
                            </p>
                          </div>
                        )}
                        
                        {engagement.commentContent && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-md">
                            <p className="text-xs text-blue-600 mb-1">Comment:</p>
                            <p className="text-sm text-blue-800">
                              {truncateContent(engagement.commentContent)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
