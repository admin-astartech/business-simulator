'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import moment from 'moment'
import { 
  LayoutDashboard, 
  Users, 
  Banknote, 
  MessageCircle, 
  BarChart3, 
  Smartphone,
  ChevronRight,
  ChevronDown,
  Earth,
  Settings
} from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useUnreadCitizenMessages } from '../hooks/useUnreadCitizenMessages'
import Image from 'next/image'
import { getCitizenImage } from '@/lib/citizen'

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, hasSubmenu: false },
  { 
    name: 'Citizens', 
    href: '/citizens', 
    icon: Users, 
    hasSubmenu: true,
    submenu: [
      { name: 'All Citizens', href: '/citizens', icon: Users },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 }
    ]
  },
  { name: 'Bank', href: '/bank', icon: Banknote, hasSubmenu: false },
  { 
    name: 'Social Media', 
    href: '/social-media', 
    icon: Smartphone, 
    hasSubmenu: true,
    submenu: [
      { name: 'Platforms', href: '/social-media', icon: Smartphone },
      { name: 'Messages', href: '/conversations', icon: MessageCircle }
    ]
  },
  { name: 'Settings', href: '/settings', icon: Settings, hasSubmenu: false },
]

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const { profile, loading, fetchProfile } = useProfile()
  const { totalUnreadCount, conversationsWithUnread } = useUnreadCitizenMessages()

  // Update date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Listen for profile updates to refresh XP display
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchProfile()
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate)
  }, [fetchProfile])

  // Format date and time in a human-friendly manner using Moment.js
  const formatDateTime = (date: Date) => {
    return moment(date).format('MMM Do YY, h:mm A')
  }

  // Generate initials from first and last name
  const getInitials = (name: string) => {
    const nameParts = name.trim().split(' ')
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    } else if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase()
    }
    return '?'
  }

  // Get unread count for specific menu items
  const getUnreadCount = (itemName: string) => {
    switch (itemName) {
      case 'Messages':
        return totalUnreadCount
      default:
        return 0
    }
  }

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchProfile()
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate)
  }, [fetchProfile])

  return (
    <div className={`bg-[#201f50] text-white transition-all duration-300 w-64
    } h-screen flex flex-col fixed left-0 top-0 z-50`}>
      {/* Header - Company Branding */}
      <div className="p-6 border-b border-[#333270]">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Image src="/Earth.jpg" alt="logo" width={40} height={40} />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h2 className="text-xl font-bold">Earth Simulator</h2>
              <p className="text-xs text-white/70 mt-1">
                {formatDateTime(currentDateTime)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const isActive = activeItem === item.name
            const isSubmenuOpen = openSubmenus.includes(item.name)
            
            const toggleSubmenu = () => {
              if (item.hasSubmenu) {
                setOpenSubmenus(prev => 
                  prev.includes(item.name) 
                    ? prev.filter(name => name !== item.name)
                    : [...prev, item.name]
                )
              }
            }
            
            return (
              <li key={item.name}>
                {item.hasSubmenu ? (
                  <div>
                    <button
                      onClick={toggleSubmenu}
                      className={`flex items-center p-3 rounded-lg transition-colors group w-full ${
                        isActive 
                          ? 'bg-[#333270] text-white' 
                          : 'hover:bg-[#333270]/50 text-white/90 hover:text-white'
                      }`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <div className="relative">
                        <IconComponent className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                        {isCollapsed && totalUnreadCount > 0 && item.name === 'Citizens' && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <>
                          <span className="font-medium flex-1 text-left">{item.name}</span>
                          {isSubmenuOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </button>
                    {!isCollapsed && isSubmenuOpen && item.submenu && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIconComponent = subItem.icon
                          const isSubActive = activeItem === subItem.name
                          const unreadCount = getUnreadCount(subItem.name)
                          
                          return (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                onClick={() => setActiveItem(subItem.name)}
                                className={`flex items-center p-2 rounded-lg transition-colors group ${
                                  isSubActive 
                                    ? 'bg-[#333270] text-white' 
                                    : 'hover:bg-[#333270]/50 text-white/90 hover:text-white'
                                }`}
                              >
                                <SubIconComponent className="w-4 h-4 mr-3" />
                                <span className="font-medium flex-1">{subItem.name}</span>
                                {unreadCount > 0 && (
                                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                  </span>
                                )}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setActiveItem(item.name)}
                    className={`flex items-center p-3 rounded-lg transition-colors group ${
                      isActive 
                        ? 'bg-[#333270] text-white' 
                        : 'hover:bg-[#333270]/50 text-white/90 hover:text-white'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <IconComponent className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer - User Profile */}
      <div className="p-4 border-t border-[#333270]">
        <Link 
          href="/profile"
          onClick={() => setActiveItem('Profile')}
          className={`flex items-center ${isCollapsed ? 'justify-center' : ''} p-2 rounded-lg transition-colors hover:bg-[#333270]/50 group cursor-pointer`}
          title={isCollapsed ? 'Profile' : undefined}
        >
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {loading ? (
              <div className="w-full h-full bg-gray-400 animate-pulse rounded-full" />
            ) : profile ? (
              profile.avatarColor ? (
                <div className={`w-full h-full ${profile.avatarColor} flex items-center justify-center text-white font-semibold text-sm`}>
                  <Image src={getCitizenImage(profile.name, profile.gender)} alt="User avatar" width={40} height={40} />
                </div>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" 
                  alt="User avatar" 
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm">
                ?
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  {loading ? (
                    <>
                      <div className="h-4 bg-gray-400 animate-pulse rounded w-20 mb-1" />
                      <div className="h-3 bg-gray-400 animate-pulse rounded w-24 mb-1" />
                      <div className="h-3 bg-gray-400 animate-pulse rounded w-16" />
                    </>
                  ) : profile ? (
                    <>
                      <p className="text-sm font-medium text-white">{profile.name}</p>
                      <p className="text-xs text-white/70">{profile.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-yellow-400 font-medium">⭐</span>
                        <span className="text-xs text-yellow-400 font-medium">{profile.xp || 0} XP</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-white">Loading...</p>
                      <p className="text-xs text-white/70">Please wait</p>
                    </>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}
        </Link>
      </div>
    </div>
  )
}
