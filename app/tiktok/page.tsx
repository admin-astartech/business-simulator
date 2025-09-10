'use client'

import { useState, useMemo, useEffect } from 'react'
import { transformCitizensToTikTokProfiles } from '@/lib/socialMediaUtils'
import { useTikTokPosts } from '@/hooks/useTikTokPosts'
import { useCitizensForSocial } from '@/hooks/useCitizensForSocial'
import { Music, BarChart3, Users, Activity } from 'lucide-react'
import TabNavigation from '@/components/social-media/TabNavigation'
import PlatformSection from '@/components/social-media/PlatformSection'
import TikTokAccountsSection from '@/components/social-media/TikTokAccountsSection'
import TikTokPostModal from '@/components/social-media/TikTokPostModal'
import ActivityTab from '@/components/social-media/ActivityTab'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { socialPlatforms } from '@/data/socialMediaData'

export default function TikTokPage() {
  const [tiktokSubTab, setTiktokSubTab] = useState('overview')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Fetch citizens data from database
  const { citizens, loading: citizensLoading, error: citizensError, refetch: refetchCitizens } = useCitizensForSocial()

  // Fetch TikTok posts from MongoDB
  const { posts: tiktokPosts, loading: tiktokLoading, error: tiktokError, refetch: refetchTikTokPosts } = useTikTokPosts()

  // Update last refresh time when posts are refetched
  useEffect(() => {
    if (!tiktokLoading) {
      setLastRefresh(new Date())
    }
  }, [tiktokLoading])

  const tiktokSubTabs = [
    { id: 'overview', name: 'Feed', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'accounts', name: 'Accounts', icon: <Users className="h-4 w-4" /> },
    { id: 'activity', name: 'Activity', icon: <Activity className="h-4 w-4" /> },
  ]

  const handlePostCreated = () => {
    // Refresh posts after creating a new one
    refetchTikTokPosts()
    setLastRefresh(new Date())
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/tiktok-posts?id=${postId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Refresh posts after deleting
        refetchTikTokPosts()
        setLastRefresh(new Date())
      } else {
        throw new Error(data.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting TikTok post:', error)
      throw error
    }
  }

  // Transform citizen data to TikTok profiles
  const tiktokProfiles = useMemo(() => 
    transformCitizensToTikTokProfiles(citizens), 
    [citizens]
  )

  const renderTikTokContent = () => {
    if (tiktokSubTab === 'overview') {
      if (tiktokLoading) {
        return (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        )
      }

      if (tiktokError) {
        return (
          <div className="flex justify-center items-center py-12">
            <ErrorMessage 
              message={tiktokError}
              onRetry={refetchTikTokPosts}
            />
          </div>
        )
      }

      return (
        <PlatformSection
          platform={socialPlatforms[1]}
          posts={tiktokPosts}
          postsTitle="Recent TikTok Posts"
          showShares={true}
          onRefetch={refetchTikTokPosts}
          onCreatePost={() => setIsCreateModalOpen(true)}
          showCreateButton={true}
          onDeletePost={handleDeletePost}
        />
      )
    }

    if (tiktokSubTab === 'activity') {
      return <ActivityTab platform="tiktok" />
    }

    if (citizensLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      )
    }

    if (citizensError) {
      return (
        <div className="flex justify-center items-center py-12">
          <ErrorMessage 
            message={citizensError}
            onRetry={refetchCitizens}
          />
        </div>
      )
    }

    return <TikTokAccountsSection profiles={tiktokProfiles} citizens={citizens} />
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Music className="h-8 w-8 text-black" />
              TikTok
            </h1>
            <p className="text-gray-600">Manage your TikTok presence and track viral engagement</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              <span className="text-gray-600">Manual refresh only</span>
            </div>
            <div className="text-xs text-gray-400">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow">
          <TabNavigation
            tabs={tiktokSubTabs}
            activeTab={tiktokSubTab}
            onTabChange={setTiktokSubTab}
            className="px-6"
          />
        </div>
      </div>

      {/* Content */}
      {renderTikTokContent()}

      {/* Create Post Modal */}
      <TikTokPostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  )
}
