'use client'

import { useState, useMemo, useEffect } from 'react'
import { transformCitizensToInstagramProfiles } from '@/lib/socialMediaUtils'
import { useInstagramPosts } from '@/hooks/useInstagramPosts'
import { useCitizensForSocial } from '@/hooks/useCitizensForSocial'
import { Camera, BarChart3, Users, Activity } from 'lucide-react'
import TabNavigation from '@/components/social-media/TabNavigation'
import PlatformSection from '@/components/social-media/PlatformSection'
import InstagramAccountsSection from '@/components/social-media/InstagramAccountsSection'
import InstagramPostModal from '@/components/social-media/InstagramPostModal'
import ActivityTab from '@/components/social-media/ActivityTab'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { socialPlatforms } from '@/data/socialMediaData'

export default function InstagramPage() {
  const [instagramSubTab, setInstagramSubTab] = useState('overview')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Fetch citizens data from database
  const { citizens, loading: citizensLoading, error: citizensError, refetch: refetchCitizens } = useCitizensForSocial()

  // Fetch Instagram posts from MongoDB
  const { posts: instagramPosts, loading: instagramLoading, error: instagramError, refetch: refetchInstagramPosts } = useInstagramPosts()

  // Update last refresh time when posts are refetched
  useEffect(() => {
    if (!instagramLoading) {
      setLastRefresh(new Date())
    }
  }, [instagramLoading])

  const instagramSubTabs = [
    { id: 'overview', name: 'Feed', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'accounts', name: 'Accounts', icon: <Users className="h-4 w-4" /> },
    { id: 'activity', name: 'Activity', icon: <Activity className="h-4 w-4" /> },
  ]

  const handlePostCreated = () => {
    // Refresh posts after creating a new one
    refetchInstagramPosts()
    setLastRefresh(new Date())
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/instagram-posts?id=${postId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Refresh posts after deleting
        refetchInstagramPosts()
        setLastRefresh(new Date())
      } else {
        throw new Error(data.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting Instagram post:', error)
      throw error
    }
  }

  // Transform citizen data to Instagram profiles
  const instagramProfiles = useMemo(() => 
    transformCitizensToInstagramProfiles(citizens), 
    [citizens]
  )

  const renderInstagramContent = () => {
    if (instagramSubTab === 'overview') {
      if (instagramLoading) {
        return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
        )
      }

      if (instagramError) {
        return (
          <div className="flex justify-center items-center py-12">
            <ErrorMessage 
              message={instagramError}
              onRetry={refetchInstagramPosts}
            />
          </div>
        )
      }

      return (
        <PlatformSection
          platform={socialPlatforms[2]}
          posts={instagramPosts}
          postsTitle="Recent Instagram Posts"
          showShares={false}
          onRefetch={refetchInstagramPosts}
          onCreatePost={() => setIsCreateModalOpen(true)}
          showCreateButton={true}
          onDeletePost={handleDeletePost}
        />
      )
    }

    if (instagramSubTab === 'activity') {
      return <ActivityTab platform="instagram" />
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

    return <InstagramAccountsSection profiles={instagramProfiles} citizens={citizens} />
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Camera className="h-8 w-8 text-pink-600" />
              Instagram
            </h1>
            <p className="text-gray-600">Manage your Instagram presence and track visual engagement</p>
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
            tabs={instagramSubTabs}
            activeTab={instagramSubTab}
            onTabChange={setInstagramSubTab}
            className="px-6"
          />
        </div>
      </div>

      {/* Content */}
      {renderInstagramContent()}

      {/* Create Post Modal */}
      <InstagramPostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  )
}
