'use client'

import { useState, useMemo } from 'react'
import { transformCitizensToLinkedInProfiles } from '@/lib/socialMediaUtils'
import { useLinkedInPosts } from '@/hooks/useLinkedInPosts'
import { useCitizensForSocial } from '@/hooks/useCitizensForSocial'
import { Briefcase, BarChart3, Users, Plus, Activity } from 'lucide-react'
import TabNavigation from '@/components/social-media/TabNavigation'
import PlatformSection from '@/components/social-media/PlatformSection'
import LinkedInAccountsSection from '@/components/social-media/LinkedInAccountsSection'
import LinkedInPostModal from '@/components/social-media/LinkedInPostModal'
import ActivityTab from '@/components/social-media/ActivityTab'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { socialPlatforms } from '@/data/socialMediaData'
import Button from '@/components/buttons/button'

export default function LinkedInPage() {
  const [linkedInSubTab, setLinkedInSubTab] = useState('overview')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Fetch citizens data from database
  const { citizens, loading: citizensLoading, error: citizensError, refetch: refetchCitizens } = useCitizensForSocial()

  // Fetch LinkedIn posts from MongoDB
  const { posts: linkedInPosts, loading: linkedInLoading, error: linkedInError, refetch: refetchLinkedInPosts } = useLinkedInPosts()

  // Update last refresh time when posts are refetched
  const linkedInSubTabs = [
    { id: 'overview', name: 'Feed', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'accounts', name: 'Accounts', icon: <Users className="h-4 w-4" /> },
    { id: 'activity', name: 'Activity', icon: <Activity className="h-4 w-4" /> },
  ]

  const handlePostCreated = () => {
    // Refresh posts after creating a new one
    refetchLinkedInPosts()
    setLastRefresh(new Date())
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/linkedin-posts?id=${postId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Refresh posts after deleting
        refetchLinkedInPosts()
        setLastRefresh(new Date())
      } else {
        throw new Error(data.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting LinkedIn post:', error)
      throw error
    }
  }

  // Transform citizen data to LinkedIn profiles
  const linkedInProfiles = useMemo(() => 
    transformCitizensToLinkedInProfiles(citizens), 
    [citizens]
  )

  const renderLinkedInContent = () => {
    if (linkedInSubTab === 'overview') {
      if (linkedInLoading) {
        return (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        )
      }

      if (linkedInError) {
        return (
          <div className="flex justify-center items-center py-12">
            <ErrorMessage 
              message={linkedInError}
              onRetry={refetchLinkedInPosts}
            />
          </div>
        )
      }

      return (
        <PlatformSection
          platform={socialPlatforms[0]}
          posts={linkedInPosts}
          postsTitle="Feed"
          showShares={true}
          onRefetch={refetchLinkedInPosts}
          onCreatePost={() => setIsCreateModalOpen(true)}
          showCreateButton={true}
          onDeletePost={handleDeletePost}
        />
      )
    }

    if (linkedInSubTab === 'activity') {
      return <ActivityTab platform="linkedin" />
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

    return <LinkedInAccountsSection profiles={linkedInProfiles} citizens={citizens} />
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              LinkedIn
            </h1>
            <p className="text-gray-600">Manage your LinkedIn presence and track professional engagement</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow">
          <TabNavigation
            tabs={linkedInSubTabs}
            activeTab={linkedInSubTab}
            onTabChange={setLinkedInSubTab}
            className="px-6"
          />
        </div>
      </div>

      {/* Content */}
      {renderLinkedInContent()}

      {/* Create Post Modal */}
      <LinkedInPostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  )
}
