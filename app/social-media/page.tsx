'use client'

import { useState, useMemo, useEffect } from 'react'
import { transformCitizensToLinkedInProfiles, transformCitizensToTikTokProfiles, transformCitizensToInstagramProfiles } from '@/lib/socialMediaUtils'
import { useLinkedInPosts } from '@/hooks/useLinkedInPosts'
import { useTikTokPosts } from '@/hooks/useTikTokPosts'
import { useInstagramPosts } from '@/hooks/useInstagramPosts'
import { useCitizensForSocial } from '@/hooks/useCitizensForSocial'
import { Briefcase, Music, Camera, BarChart3, Users } from 'lucide-react'
import TabNavigation from '@/components/social-media/TabNavigation'
import PlatformSection from '@/components/social-media/PlatformSection'
import LinkedInAccountsSection from '@/components/social-media/LinkedInAccountsSection'
import TikTokAccountsSection from '@/components/social-media/TikTokAccountsSection'
import InstagramAccountsSection from '@/components/social-media/InstagramAccountsSection'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { socialPlatforms } from '@/data/socialMediaData'

export default function SocialMediaPage() {
  const [activeTab, setActiveTab] = useState('linkedin')
  const [linkedInSubTab, setLinkedInSubTab] = useState('overview')
  const [tiktokSubTab, setTiktokSubTab] = useState('overview')
  const [instagramSubTab, setInstagramSubTab] = useState('overview')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Fetch citizens data from database
  const { citizens, loading: citizensLoading, error: citizensError, refetch: refetchCitizens } = useCitizensForSocial()

  // Fetch LinkedIn posts from MongoDB
  const { posts: linkedInPosts, loading: linkedInLoading, error: linkedInError, refetch: refetchLinkedInPosts } = useLinkedInPosts()

  // Fetch TikTok posts from MongoDB
  const { posts: tiktokPosts, loading: tiktokLoading, error: tiktokError, refetch: refetchTikTokPosts } = useTikTokPosts()

  // Fetch Instagram posts from MongoDB
  const { posts: instagramPosts, loading: instagramLoading, error: instagramError, refetch: refetchInstagramPosts } = useInstagramPosts()

  // Update last refresh time when any posts are refetched
  useEffect(() => {
    if (!linkedInLoading && !tiktokLoading && !instagramLoading) {
      setLastRefresh(new Date())
    }
  }, [linkedInLoading, tiktokLoading, instagramLoading])

  const tabs = [
    { id: 'linkedin', name: 'LinkedIn', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'tiktok', name: 'TikTok', icon: <Music className="h-4 w-4" /> },
    { id: 'instagram', name: 'Instagram', icon: <Camera className="h-4 w-4" /> },
  ]

  const linkedInSubTabs = [
    { id: 'overview', name: 'Feed', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'accounts', name: 'Accounts', icon: <Users className="h-4 w-4" /> },
  ]

  const tiktokSubTabs = [
    { id: 'overview', name: 'Feed', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'accounts', name: 'Accounts', icon: <Users className="h-4 w-4" /> },
  ]

  const instagramSubTabs = [
    { id: 'overview', name: 'Feed', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'accounts', name: 'Accounts', icon: <Users className="h-4 w-4" /> },
  ]

  // Transform citizen data to social media profiles
  const linkedInProfiles = useMemo(() => 
    transformCitizensToLinkedInProfiles(citizens), 
    [citizens]
  )

  const tiktokProfiles = useMemo(() => 
    transformCitizensToTikTokProfiles(citizens), 
    [citizens]
  )

  const instagramProfiles = useMemo(() => 
    transformCitizensToInstagramProfiles(citizens), 
    [citizens]
  )

  const renderLinkedInContent = () => {
    if (linkedInSubTab === 'overview') {
      if (linkedInLoading) {
        return (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
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
          postsTitle="Recent LinkedIn Posts"
          showShares={true}
          onRefetch={refetchLinkedInPosts}
        />
      )
    }

    if (citizensLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
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

  const renderTikTokContent = () => {
    if (tiktokSubTab === 'overview') {
      if (tiktokLoading) {
        return (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
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
        />
      )
    }

    if (citizensLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
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

  const renderInstagramContent = () => {
    if (instagramSubTab === 'overview') {
      if (instagramLoading) {
        return (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
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
        />
      )
    }

    if (citizensLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
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

  const renderPlatformContent = () => {
    switch (activeTab) {
      case 'linkedin':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <TabNavigation
                tabs={linkedInSubTabs}
                activeTab={linkedInSubTab}
                onTabChange={setLinkedInSubTab}
                className="px-6"
              />
            </div>
            {renderLinkedInContent()}
          </div>
        )
      case 'tiktok':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <TabNavigation
                tabs={tiktokSubTabs}
                activeTab={tiktokSubTab}
                onTabChange={setTiktokSubTab}
                className="px-6"
              />
            </div>
            {renderTikTokContent()}
          </div>
        )
      case 'instagram':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <TabNavigation
                tabs={instagramSubTabs}
                activeTab={instagramSubTab}
                onTabChange={setInstagramSubTab}
                className="px-6"
              />
            </div>
            {renderInstagramContent()}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Media</h1>
            <p className="text-gray-600">Manage your social media presence and track engagement</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              {linkedInLoading || tiktokLoading || instagramLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  Refreshing posts...
                </span>
              ) : (
                <span className="text-green-600">✓ Auto-refresh enabled</span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="mb-1">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Content */}
      {renderPlatformContent()}
    </div>
  )
}
