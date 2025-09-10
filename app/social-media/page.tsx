'use client'

import Link from 'next/link'
import { Smartphone, MessageCircle, Briefcase, Camera, Music } from 'lucide-react'

export default function SocialMediaPage() {
  const socialMediaOptions = [
    { 
      name: 'LinkedIn', 
      href: '/linkedin', 
      icon: <Briefcase className="h-6 w-6 text-blue-600" />,
      description: 'Professional networking and business content'
    },
    { 
      name: 'Instagram', 
      href: '/instagram', 
      icon: <Camera className="h-6 w-6 text-pink-600" />,
      description: 'Visual content and stories'
    },
    { 
      name: 'TikTok', 
      href: '/tiktok', 
      icon: <Music className="h-6 w-6 text-black" />,
      description: 'Short-form video content'
    },
    { 
      name: 'Messages', 
      href: '/conversations', 
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      description: 'Manage conversations and engagement'
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Smartphone className="h-8 w-8 text-purple-600" />
              Social Media Hub
            </h1>
            <p className="text-gray-600">Access all your social media platforms and manage your online presence</p>
          </div>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {socialMediaOptions.map((option) => (
          <Link
            key={option.name}
            href={option.href}
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 hover:border-gray-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                {option.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                  {option.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {option.description}
                </p>
              </div>
              <div className="w-full">
                <div className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                  Click to manage →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats or Additional Info */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Centralized Social Media Management
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each platform has its own dedicated page where you can manage posts, track engagement, 
            and monitor your social media presence. Click on any platform above to get started.
          </p>
        </div>
      </div>
    </div>
  )
}
