import { SocialPlatform, SocialPost } from '@/types/socialMedia'
import PostsList from './PostsList'

interface PlatformSectionProps {
  platform: SocialPlatform
  posts: SocialPost[]
  postsTitle: string
  showShares?: boolean
  onRefetch?: () => void
  onCreatePost?: () => void
  showCreateButton?: boolean
  onDeletePost?: (postId: string) => Promise<void>
}

export default function PlatformSection({ 
  platform, 
  posts, 
  postsTitle, 
  showShares = false,
  onRefetch,
  onCreatePost,
  showCreateButton = false,
  onDeletePost
}: PlatformSectionProps) {
  return (
    <div className="space-y-6">
      <PostsList 
        posts={posts} 
        title={postsTitle} 
        showShares={showShares} 
        onRefetch={onRefetch}
        onCreatePost={onCreatePost}
        showCreateButton={showCreateButton}
        onDeletePost={onDeletePost}
      />
    </div>
  )
}
