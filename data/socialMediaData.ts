import { SocialPlatform, PlatformPosts } from '@/types/socialMedia'

// Function to get social platform data with icons
export const getSocialPlatforms = () => {
  const { Briefcase, Music, Camera } = require('lucide-react')
  
  return [
    { name: 'LinkedIn', icon: Briefcase, followers: '3.2K', engagement: '2.1%', posts: 45 },
    { name: 'TikTok', icon: Music, followers: '18.7K', engagement: '8.4%', posts: 23 },
    { name: 'Instagram', icon: Camera, followers: '8.9K', engagement: '6.8%', posts: 67 },
  ] as SocialPlatform[]
}

// For backward compatibility, export as a function call
export const socialPlatforms = getSocialPlatforms()

export const platformPosts: PlatformPosts = {
  linkedin: [
    {
      id: 1,
      content: 'How business simulation can improve decision-making skills in the corporate world',
      likes: 23,
      comments: 7,
      shares: 3,
      time: '1d ago'
    },
    {
      id: 2,
      content: 'The future of business education: interactive simulations vs traditional case studies',
      likes: 45,
      comments: 12,
      shares: 8,
      time: '3d ago'
    },
    {
      id: 3,
      content: '5 key insights from our latest business simulation workshop',
      likes: 18,
      comments: 4,
      shares: 2,
      time: '1w ago'
    }
  ],
  tiktok: [
    {
      id: 1,
      content: 'POV: You just learned about business simulation for the first time 🎯',
      likes: 1200,
      comments: 89,
      shares: 45,
      time: '2h ago'
    },
    {
      id: 2,
      content: 'Quick business tip that changed everything 💡',
      likes: 890,
      comments: 67,
      shares: 23,
      time: '1d ago'
    },
    {
      id: 3,
      content: 'Behind the scenes of our development process 📱',
      likes: 2100,
      comments: 156,
      shares: 78,
      time: '3d ago'
    }
  ],
  instagram: [
    {
      id: 1,
      content: 'Behind the scenes of our development process 📱 #BusinessSim #TechLife',
      likes: 89,
      comments: 15,
      time: '5h ago'
    },
    {
      id: 2,
      content: 'Team work makes the dream work! 🚀 #StartupLife #Innovation',
      likes: 134,
      comments: 23,
      time: '1d ago'
    },
    {
      id: 3,
      content: 'New features coming soon! Stay tuned 👀 #ProductUpdate',
      likes: 67,
      comments: 12,
      time: '2d ago'
    }
  ]
}
