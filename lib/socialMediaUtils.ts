import { Citizen } from '@/types/citizens'
import { LinkedInProfile, TikTokProfile, InstagramProfile } from '@/types/socialMedia'

export function transformCitizensToLinkedInProfiles(citizens: Citizen[]): LinkedInProfile[] {
  return citizens
    .filter(citizen => citizen.socialMedia?.linkedIn)
    .map(citizen => ({
      id: citizen.id,
      name: citizen.name,
      headline: citizen.socialMedia.linkedIn.headline,
      location: citizen.socialMedia.linkedIn.location,
      connections: citizen.socialMedia.linkedIn.connections,
      followers: citizen.socialMedia.linkedIn.followers,
      experience: 2025 - citizen.socialMedia.linkedIn.currentRole.startYear,
      skills: citizen.socialMedia.linkedIn.skills,
      url: citizen.socialMedia.linkedIn.url,
      avatarColor: citizen.avatarColor,
      initials: citizen.initials,
      isOnline: citizen.isOnline,
      lastSeen: citizen.lastSeen
    }))
}

export function transformCitizensToTikTokProfiles(citizens: Citizen[]): TikTokProfile[] {
  return citizens
    .filter(citizen => citizen.socialMedia?.tikTok)
    .map(citizen => ({
      id: citizen.id,
      name: citizen.name,
      handle: citizen.socialMedia.tikTok.handle,
      bio: citizen.socialMedia.tikTok.bio,
      followers: citizen.socialMedia.tikTok.followers,
      following: citizen.socialMedia.tikTok.following,
      totalLikes: citizen.socialMedia.tikTok.totalLikes,
      videoCount: citizen.socialMedia.tikTok.videoCount,
      avgViews: citizen.socialMedia.tikTok.avgViews,
      engagementRate: citizen.socialMedia.tikTok.engagementRatePct,
      topics: citizen.socialMedia.tikTok.topics,
      contentStyle: citizen.socialMedia.tikTok.contentStyle,
      url: citizen.socialMedia.tikTok.url,
      avatarColor: citizen.avatarColor,
      initials: citizen.initials,
      isOnline: citizen.isOnline,
      lastSeen: citizen.lastSeen
    }))
}

export function transformCitizensToInstagramProfiles(citizens: Citizen[]): InstagramProfile[] {
  return citizens
    .filter(citizen => citizen.socialMedia?.instagram)
    .map(citizen => ({
      id: citizen.id,
      name: citizen.name,
      handle: citizen.socialMedia.instagram.handle,
      bio: citizen.socialMedia.instagram.bio,
      followers: citizen.socialMedia.instagram.followers,
      following: citizen.socialMedia.instagram.following,
      postsCount: citizen.socialMedia.instagram.postsCount,
      avgLikes: citizen.socialMedia.instagram.avgLikes,
      avgComments: citizen.socialMedia.instagram.avgComments,
      engagementRate: citizen.socialMedia.instagram.engagementRatePct,
      contentThemes: citizen.socialMedia.instagram.contentThemes,
      storyCadence: citizen.socialMedia.instagram.storyCadence,
      reelsSharePct: citizen.socialMedia.instagram.reelsSharePct,
      hashtags: citizen.socialMedia.instagram.hashtags,
      highlights: citizen.socialMedia.instagram.highlights,
      gridStyle: citizen.socialMedia.instagram.gridStyle,
      verified: citizen.socialMedia.instagram.verified,
      url: citizen.socialMedia.instagram.url,
      avatarColor: citizen.avatarColor,
      initials: citizen.initials,
      isOnline: citizen.isOnline,
      lastSeen: citizen.lastSeen
    }))
}
