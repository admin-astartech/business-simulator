import { SocialPlatform, SocialPost } from '@/types/socialMedia'
import PostsList from './PostsList'

interface PlatformSectionProps {
  platform: SocialPlatform
  posts: SocialPost[]
  postsTitle: string
  showShares?: boolean
  onRefetch?: () => void
}

export default function PlatformSection({ 
  platform, 
  posts, 
  postsTitle, 
  showShares = false,
  onRefetch
}: PlatformSectionProps) {
  const stats = [
    { label: 'Posts', value: platform.posts },
    { label: 'Engagement', value: platform.engagement, color: 'text-green-600' },
    { 
      label: platform.name === 'TikTok' ? 'Videos' : 'Connections', 
      value: platform.name === 'TikTok' ? '23' : '156',
      color: platform.name === 'TikTok' ? 'text-pink-600' : 'text-blue-600'
    }
  ]

  return (
    <div className="space-y-6">
      <PostsList posts={posts} title={postsTitle} showShares={showShares} onRefetch={onRefetch} />
    </div>
  )
}
