import { SocialPost } from '@/types/socialMedia'
import { Citizen } from '@/types/citizens'
import { FileText, Heart, MessageCircle, Loader2, BarChart3, MessageSquare, MoreVertical, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { getCitizenImage } from '@/lib/citizen'
import { useEffect, useState } from 'react'
import { useProfile } from '@/hooks/useProfile'
import CitizenChatModal from '@/components/citizens/CitizenChatModal'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material'
import Button from '@/components/buttons/button'
import DeletePostModal from './DeletePostModal'

interface PostsListProps {
  posts: SocialPost[]
  title: string
  showShares?: boolean
  onRefetch?: () => void
  onCreatePost?: () => void
  showCreateButton?: boolean
  onDeletePost?: (postId: string) => Promise<void>
}

interface EngagementReason {
  citizenId: string
  citizenName: string
  engagementType: 'like' | 'comment'
  engagementReason: string
  commentContent?: string
  timestamp: string
}

export default function PostsList({ posts, title, showShares = false, onRefetch, onCreatePost, showCreateButton = false, onDeletePost }: PostsListProps) {
  const [citizens, setCitizens] = useState<Map<string, Citizen>>(new Map())
  const [citizensLoading, setCitizensLoading] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [updatingLikes, setUpdatingLikes] = useState<Set<string>>(new Set())
  const [commentedPosts, setCommentedPosts] = useState<Set<string>>(new Set())
  const [updatingComments, setUpdatingComments] = useState<Set<string>>(new Set())
  const [openCommentBoxes, setOpenCommentBoxes] = useState<Set<string>>(new Set())
  const [commentTexts, setCommentTexts] = useState<Map<string, string>>(new Map())
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null)
  const [engagementReasons, setEngagementReasons] = useState<EngagementReason[]>([])
  const [loadingEngagement, setLoadingEngagement] = useState(false)
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<SocialPost | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { profile, fetchProfile } = useProfile()

  // Refresh profile data when posts change to ensure we have the latest user info
  useEffect(() => {
    if (posts.length > 0) {
      // Only refresh if we don't have profile data or if there are user posts
      const hasUserPosts = posts.some(post => profile && post.author === profile.name)
      if (!profile || hasUserPosts) {
        fetchProfile()
      }
    }
  }, [posts, fetchProfile, profile])

  // Fetch citizen data for all posts with citizenId and comment authors
  useEffect(() => {
    const fetchCitizenData = async () => {
      // Collect citizen IDs from posts
      const postCitizenIds = posts
        .map(post => post.citizenId)
        .filter((id): id is string => id !== undefined)

      // Collect author IDs from all comments
      const commentAuthorIds = posts
        .flatMap(post => post.commentsList || [])
        .map(comment => comment.authorId)
        .filter((id): id is string => id !== undefined)

      // Combine and deduplicate all citizen IDs
      const allCitizenIds = Array.from(new Set([...postCitizenIds, ...commentAuthorIds]))

      if (allCitizenIds.length === 0) {
        return
      }

      try {
        setCitizensLoading(true)

        // Fetch all citizens and filter for the ones we need
        const response = await fetch('/api/citizens')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const allCitizens = data.citizens || []

        // Filter to only the citizens we need
        const citizensData = allCitizens.filter((citizen: Citizen) =>
          allCitizenIds.includes(citizen.id)
        )

        const citizensMap = new Map<string, Citizen>()

        citizensData.forEach((citizen: Citizen) => {
          citizensMap.set(citizen.id, citizen)
        })

        setCitizens(citizensMap)
      } catch (error) {
        console.error('Error fetching citizen data:', error)
      } finally {
        setCitizensLoading(false)
      }
    }

    fetchCitizenData()
  }, [posts])

  // Initialize liked posts from database data
  useEffect(() => {
    if (!profile?.id) return

    const likedPostIds = new Set<string>()
    posts.forEach(post => {
      if (post.likedBy?.includes(profile.id)) {
        likedPostIds.add(String(post.id))
      }
    })
    setLikedPosts(likedPostIds)
  }, [posts, profile?.id])

  // Initialize commented posts from database data (placeholder for future implementation)
  useEffect(() => {
    if (!profile?.id) return

    // For now, we'll track comments locally
    // In the future, this could be populated from a commentedBy array in the database
    const commentedPostIds = new Set<string>()
    setCommentedPosts(commentedPostIds)
  }, [posts, profile?.id])

  const getCitizenForPost = (post: SocialPost): Citizen | null => {
    if (!post.citizenId) return null
    return citizens.get(post.citizenId) || null
  }

  const isUserPost = (post: SocialPost): boolean => {
    return profile ? post.citizenId === profile.id : false
  }

  // Filter out hashtags from post content to avoid duplication
  const getFilteredContent = (post: SocialPost): string => {
    if (!post.hashtags || post.hashtags.length === 0) {
      return post.content
    }
    
    let filteredContent = post.content
    
    // Debug: Log the original content and hashtags
    if (post.content.includes('#')) {
      console.log('🔍 Filtering hashtags from content:')
      console.log('  Original:', post.content)
      console.log('  Hashtags array:', post.hashtags)
    }
    
    // Remove each hashtag from the content
    post.hashtags.forEach(tag => {
      // Remove # from tag if it exists (since hashtags are stored with # in database)
      const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag
      // Create a simple regex to match the hashtag
      const hashtagRegex = new RegExp(`#${cleanTag}`, 'gi')
      const beforeReplace = filteredContent
      filteredContent = filteredContent.replace(hashtagRegex, '')
      
      if (beforeReplace !== filteredContent) {
        console.log(`  ✅ Removed #${cleanTag}: "${beforeReplace}" -> "${filteredContent}"`)
      }
    })
    
    // Clean up multiple spaces and trim
    const cleanedContent = filteredContent.replace(/\s+/g, ' ').trim()
    
    if (post.content.includes('#')) {
      console.log('  Final result:', cleanedContent)
    }
    
    // If content becomes empty after filtering, show original content
    return cleanedContent || post.content
  }

  const handleLikeToggle = async (post: SocialPost) => {
    if (!profile?.id) {
      console.error('No profile found - cannot like post')
      return
    }

    const postIdString = String(post.id)
    const platform = post.platform || 'instagram' // Default to instagram if not specified

    // Prevent multiple simultaneous requests for the same post
    if (updatingLikes.has(postIdString)) {
      return
    }

    try {
      setUpdatingLikes(prev => new Set(prev).add(postIdString))

      const response = await fetch('/api/posts/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id, // Use the post id from the transformed data
          platform,
          userId: profile.id
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Update local state
        setLikedPosts(prev => {
          const newLikedPosts = new Set(prev)
          if (result.isLiked) {
            newLikedPosts.add(postIdString)
          } else {
            newLikedPosts.delete(postIdString)
          }
          return newLikedPosts
        })

        // Refetch posts data to get updated like counts from database
        if (onRefetch) {
          onRefetch()
        }

        // Award XP for liking/unliking posts
        await awardXP(result.isLiked ? 5 : -5) // 5 XP for liking, -5 XP for unliking
      } else {
        console.error('Failed to update like:', result.error)
      }
    } catch (error) {
      console.error('Error updating like:', error)
    } finally {
      setUpdatingLikes(prev => {
        const newSet = new Set(prev)
        newSet.delete(postIdString)
        return newSet
      })
    }
  }

  const getLikeCount = (post: SocialPost) => {
    return post.likes || 0
  }

  const getAuthorName = (authorId: string): string => {
    // First, check if it's the current user profile
    if (profile?.id === authorId) {
      return profile.name || 'You'
    }

    // Then, check if it's a citizen
    const citizen = citizens.get(authorId)
    if (citizen) {
      return citizen.name
    }

    // If citizens are still loading, show a loading indicator
    if (citizensLoading) {
      return 'Loading...'
    }

    // Fallback to a generic name if no citizen found
    return 'Unknown User'
  }

  const handleOpenChat = (post: SocialPost) => {
    const citizen = getCitizenForPost(post)
    if (citizen) {
      setSelectedCitizen(citizen)
      setChatModalOpen(true)
    }
  }

  const handleCloseChat = () => {
    setChatModalOpen(false)
    setSelectedCitizen(null)
  }

  const handleDeletePost = async (postId: string) => {
    if (!onDeletePost) return

    try {
      setIsDeleting(true)
      await onDeletePost(postId)
      setDeleteModalOpen(false)
      setPostToDelete(null)
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    } finally {
      setIsDeleting(false)
    }
  }

  const openDeleteModal = (post: SocialPost) => {
    setPostToDelete(post)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false)
      setPostToDelete(null)
    }
  }

  const awardXP = async (xpAmount: number) => {
    if (!profile?.id) return

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          xp: (profile.xp || 0) + xpAmount
        }),
      })

      if (response.ok) {
        // Trigger profile refetch to update the sidebar
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('profileUpdated'))
        }
      }
    } catch (error) {
      console.error('Error awarding XP:', error)
    }
  }

  const handleCommentToggle = (post: SocialPost) => {
    if (!profile?.id) {
      console.error('No profile found - cannot comment on post')
      return
    }

    const postIdString = String(post.id)
    const isCurrentlyOpen = openCommentBoxes.has(postIdString)

    // Toggle comment box
    setOpenCommentBoxes(prev => {
      const newSet = new Set(prev)
      if (isCurrentlyOpen) {
        newSet.delete(postIdString)
        // Clear comment text when closing
        setCommentTexts(prev => {
          const newMap = new Map(prev)
          newMap.delete(postIdString)
          return newMap
        })
      } else {
        newSet.add(postIdString)
      }
      return newSet
    })
  }

  const handleCommentSubmit = async (post: SocialPost) => {
    if (!profile?.id || !profile?.name) {
      console.error('No profile found - cannot submit comment')
      return
    }

    const postIdString = String(post.id)
    const commentText = commentTexts.get(postIdString)?.trim()

    if (!commentText) {
      console.error('Comment text is required')
      return
    }

    // Prevent multiple simultaneous requests for the same post
    if (updatingComments.has(postIdString)) {
      return
    }

    try {
      setUpdatingComments(prev => new Set(prev).add(postIdString))

      // Save comment to database
      const response = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          platform: post.platform || 'instagram',
          userId: profile.id,
          content: commentText
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Update local state to mark as commented
        setCommentedPosts(prev => {
          const newCommentedPosts = new Set(prev)
          newCommentedPosts.add(postIdString)
          return newCommentedPosts
        })

        // Close comment box and clear text
        setOpenCommentBoxes(prev => {
          const newSet = new Set(prev)
          newSet.delete(postIdString)
          return newSet
        })

        setCommentTexts(prev => {
          const newMap = new Map(prev)
          newMap.delete(postIdString)
          return newMap
        })

        // Award XP for commenting
        await awardXP(10) // 10 XP for commenting

        // Refetch posts data to get updated comment counts
        if (onRefetch) {
          onRefetch()
        }

        console.log(`Comment submitted for post ${postIdString}: ${commentText}`)
      } else {
        console.error('Failed to submit comment:', result.error)
      }

    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setUpdatingComments(prev => {
        const newSet = new Set(prev)
        newSet.delete(postIdString)
        return newSet
      })
    }
  }

  const handleCommentTextChange = (postId: string, text: string) => {
    setCommentTexts(prev => {
      const newMap = new Map(prev)
      newMap.set(postId, text)
      return newMap
    })
  }

  const handleAnalyticsClick = async (post: SocialPost) => {
    setSelectedPost(post)
    setAnalyticsModalOpen(true)
    setLoadingEngagement(true)

    try {
      const response = await fetch(`/api/engagement-log?postId=${post.id}&platform=${post.platform || 'instagram'}`)
      const data = await response.json()

      if (data.success) {
        setEngagementReasons(data.engagements || [])
      } else {
        console.error('Failed to fetch engagement data:', data.error)
        setEngagementReasons([])
      }
    } catch (error) {
      console.error('Error fetching engagement data:', error)
      setEngagementReasons([])
    } finally {
      setLoadingEngagement(false)
    }
  }

  const handleCloseAnalyticsModal = () => {
    setAnalyticsModalOpen(false)
    setSelectedPost(null)
    setEngagementReasons([])
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex items-center gap-3">
            {citizensLoading ? (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                <span>Loading...</span>
              </div>
            ) : (
              <>
                {showCreateButton && onCreatePost && (
                  <Button
                    onClick={onCreatePost}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Post
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <FileText className="h-16 w-16 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h4>
            <p className="text-gray-500 mb-4">
              {title.includes('LinkedIn')
                ? 'No LinkedIn posts have been published yet. Check back later for updates!'
                : 'No posts have been published yet. Check back later for updates!'
              }
            </p>
            <div className="text-sm text-gray-400">
              Posts will appear here once they're published
            </div>
          </div>
        ) : (
          <div className="space-y-4 transition-all duration-300">
            {posts.map((post) => {
              const citizen = getCitizenForPost(post)
              const isUser = isUserPost(post)

              return (
                <div key={post.id} className="p-4 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md">
                  {/* Post Header - Prioritize user profile data for user posts */}
                  {isUser && profile ? (
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full ${profile.avatarColor || 'bg-blue-500'} flex items-center justify-center`}>
                          <Image
                            src={getCitizenImage(profile.name, profile.gender)}
                            alt={profile.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{profile.name}</h4>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            You
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {profile.role || 'Author'}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xs text-gray-500">{post.time}</span>
                      </div>
                    </div>
                  ) : citizen ? (
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full ${citizen.avatarColor || 'bg-gray-200'} flex items-center justify-center`}>
                          <Image
                            src={getCitizenImage(citizen.name, citizen.gender)}
                            alt={citizen.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{citizen.name}</h4>
                          {profile && post.author === profile.name && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              You
                            </span>
                          )}
                          {citizen.isOnline !== undefined && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${citizen.isOnline
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                              }`}>
                              {citizen.isOnline ? '🟢 Online' : '⚫ Offline'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {citizen.role && citizen.company
                            ? `${citizen.role} at ${citizen.company}`
                            : post.author || 'Unknown Author'
                          }
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xs text-gray-500">{post.time}</span>
                      </div>
                    </div>
                  ) : citizensLoading && post.citizenId ? (
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
                          <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
                        </div>
                        <div className="h-3 bg-gray-200 animate-pulse rounded w-32 mt-1"></div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="h-3 bg-gray-200 animate-pulse rounded w-12"></div>
                      </div>
                    </div>
                  ) : null}

                  {/* Fallback for posts without citizen data (non-user posts) */}
                  {!isUser && !citizen && !citizensLoading && post.author && (
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">
                            {post.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{post.author}</h4>
                        </div>
                        <p className="text-xs text-gray-600 truncate">Author</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xs text-gray-500">{post.time}</span>
                      </div>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap flex-1">{getFilteredContent(post)}</p>
                    {/* Delete button for user's own posts */}
                    {isUser && onDeletePost && (
                      <button
                        onClick={() => openDeleteModal(post)}
                        className="ml-3 p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Hashtags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.map((hashtag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <button
                        onClick={() => handleLikeToggle(post)}
                        disabled={updatingLikes.has(String(post.id)) || !profile?.id}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed ${likedPosts.has(String(post.id))
                          ? 'text-red-500 hover:text-red-600 bg-red-50'
                          : 'text-gray-500 hover:text-red-500 hover:bg-gray-50'
                          }`}
                        aria-label={`${likedPosts.has(String(post.id)) ? 'Unlike' : 'Like'} this post`}
                      >
                        {updatingLikes.has(String(post.id)) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Heart
                            className={`w-4 h-4 ${likedPosts.has(String(post.id))
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-500'
                              }`}
                          />
                        )}
                        <span>{getLikeCount(post)}</span>
                      </button>
                      <button
                        onClick={() => handleCommentToggle(post)}
                        disabled={updatingComments.has(String(post.id)) || !profile?.id}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed ${commentedPosts.has(String(post.id))
                          ? 'text-blue-500 hover:text-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'
                          }`}
                        aria-label={`${commentedPosts.has(String(post.id)) ? 'Remove comment' : 'Add comment'} to this post`}
                      >
                        {updatingComments.has(String(post.id)) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MessageCircle className="w-4 h-4" />
                        )}
                        <span>{post.comments || 0}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {citizen && (
                        <button
                          onClick={() => handleOpenChat(post)}
                          className="flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-200 text-gray-500 hover:text-green-500 hover:bg-green-50"
                          aria-label={`Chat with ${citizen.name}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-xs">Chat</span>
                        </button>
                      )}
                      {/* Analytics Button */}
                      <button
                        onClick={() => handleAnalyticsClick(post)}
                        className="flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-500 hover:text-purple-500 hover:bg-purple-50"
                        aria-label="View engagement analytics for this post"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-xs">Analytics</span>
                      </button>
                    </div>
                  </div>

                  {/* Comment Box */}
                  {openCommentBoxes.has(String(post.id)) && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out animate-in slide-in-from-top-2">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-xs font-medium">
                              {profile?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={commentTexts.get(String(post.id)) || ''}
                            onChange={(e) => handleCommentTextChange(String(post.id), e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            maxLength={500}
                          />
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {(commentTexts.get(String(post.id)) || '').length}/500 characters
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleCommentToggle(post)}
                                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleCommentSubmit(post)}
                                disabled={!commentTexts.get(String(post.id))?.trim() || updatingComments.has(String(post.id))}
                                className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {updatingComments.has(String(post.id)) ? 'Posting...' : 'Post Comment'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Display existing comments */}
                  {post.commentsList && post.commentsList.length > 0 && (
                    <div className="mt-3 space-y-2 transition-all duration-300 ease-in-out">
                      {post.commentsList.slice(0, 3).map((comment, index) => {
                        const authorName = getAuthorName(comment.authorId)
                        return (
                          <div key={comment.id} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-md transition-all duration-200 hover:bg-gray-100">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 text-xs font-medium">
                                  {authorName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium text-gray-900">{authorName}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 mt-1">{comment.content}</p>
                            </div>
                          </div>
                        )
                      })}
                      {post.commentsList.length > 3 && (
                        <div className="text-xs text-gray-500 text-center py-1">
                          +{post.commentsList.length - 3} more comments
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Analytics Modal */}
      <Dialog
        open={analyticsModalOpen}
        onClose={handleCloseAnalyticsModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <Typography variant="h6">Post Engagement Analytics</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Post by {selectedPost.author || 'Unknown Author'}
              </Typography>
              <Typography variant="body1" sx={{
                backgroundColor: 'grey.50',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                {selectedPost.content}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {loadingEngagement ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading engagement data...
              </Typography>
            </Box>
          ) : engagementReasons.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No engagement data available for this post.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Engagement Reasons ({engagementReasons.length})
              </Typography>
              <List>
                {engagementReasons.map((engagement, index) => {
                  const citizen = citizens.get(engagement.citizenId)
                  return (
                    <ListItem key={index} divider={index < engagementReasons.length - 1}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: citizen?.avatarColor || 'grey.300',
                            width: 40,
                            height: 40
                          }}
                        >
                          {citizen ? (
                            <Image
                              src={getCitizenImage(citizen.name, citizen.gender)}
                              alt={citizen.name}
                              width={40}
                              height={40}
                              style={{ borderRadius: '50%' }}
                            />
                          ) : (
                            <Typography variant="body2">
                              {engagement.citizenName.charAt(0).toUpperCase()}
                            </Typography>
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="subtitle2">
                              {engagement.citizenName}
                            </Typography>
                            <Chip
                              label={engagement.engagementType}
                              size="small"
                              color={engagement.engagementType === 'like' ? 'error' : 'primary'}
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(engagement.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.primary" gutterBottom>
                              <strong>Reason:</strong> {engagement.engagementReason}
                            </Typography>
                            {engagement.commentContent && (
                              <Typography
                                variant="body2"
                                sx={{
                                  backgroundColor: 'grey.50',
                                  p: 1,
                                  borderRadius: 1,
                                  mt: 1
                                }}
                              >
                                <strong>Comment:</strong> {engagement.commentContent}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  )
                })}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAnalyticsModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Citizen Chat Modal */}
      {selectedCitizen && (
        <CitizenChatModal
          open={chatModalOpen}
          onClose={handleCloseChat}
          citizen={selectedCitizen}
        />
      )}

      {/* Delete Post Modal */}
      {postToDelete && (
        <DeletePostModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handleDeletePost(postToDelete.id.toString())}
          postContent={postToDelete.content}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}
