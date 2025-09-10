# Citizen Display in Social Media Posts

This document shows how social media posts now display citizen information consistently with the rest of the app.

## 🎯 Visual Example

### Before (Old Display)
```
┌─────────────────────────────────────────────────────────┐
│ 2h ago                                                   │
│                                                         │
│ Thrilled to share that our Software Engineer team at    │
│ TechCorp Inc just delivered a major project milestone!  │
│ The collaboration and dedication of everyone involved   │
│ was truly inspiring.                                    │
│                                                         │
│ Key takeaways from this project:                        │
│ • collaboration is key to success                       │
│ • data-driven decisions lead to better outcomes         │
│ • listening is more important than speaking             │
│                                                         │
│ What challenges have you faced in technology recently?  │
│ I'd love to hear your thoughts in the comments below. 👇│
│                                                         │
│ ❤️ 0  💬 0  🔄 0                                        │
└─────────────────────────────────────────────────────────┘
```

### After (New Display with Citizen Info)
```
┌─────────────────────────────────────────────────────────┐
│ ┌─────┐ Sarah Johnson                    🟢 Online  2h ago│
│ │ 👤  │ Software Engineer at TechCorp Inc                │
│ └─────┘                                                   │
│                                                         │
│ Thrilled to share that our Software Engineer team at    │
│ TechCorp Inc just delivered a major project milestone!  │
│ The collaboration and dedication of everyone involved   │
│ was truly inspiring.                                    │
│                                                         │
│ Key takeaways from this project:                        │
│ • collaboration is key to success                       │
│ • data-driven decisions lead to better outcomes         │
│ • listening is more important than speaking             │
│                                                         │
│ What challenges have you faced in technology recently?  │
│ I'd love to hear your thoughts in the comments below. 👇│
│                                                         │
│ ❤️ 0  💬 0  🔄 0                                        │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Implementation Details

### 1. Updated SocialPost Interface
```typescript
export interface SocialPost {
  id: string | number
  content: string
  likes: number
  comments: number
  shares?: number
  time: string
  author?: string
  platform?: string
  // Citizen information for display
  citizenId?: string
  citizenName?: string
  citizenRole?: string
  citizenCompany?: string
  citizenGender?: 'male' | 'female'
  citizenAvatarColor?: string
  citizenIsOnline?: boolean
}
```

### 2. Enhanced API Endpoints
All social media API endpoints now:
- Save citizen information when creating posts
- Return citizen information when fetching posts
- Include gender, avatar color, and online status

### 3. Updated PostsList Component
The `PostsList` component now displays:
- **Citizen Avatar**: Generated using `getCitizenImage()` function
- **Citizen Name**: Prominently displayed
- **Role & Company**: Shows as subtitle
- **Online Status**: Green dot for online, gray for offline
- **Consistent Styling**: Matches other app components

### 4. Database Schema Updates
Each post now includes:
```javascript
{
  // ... existing fields
  citizenId: "citizen-123",
  citizenName: "Sarah Johnson",
  citizenRole: "Software Engineer",
  citizenCompany: "TechCorp Inc",
  citizenGender: "female",
  citizenAvatarColor: "bg-blue-500",
  citizenIsOnline: true
}
```

## 🎨 Visual Components

### Citizen Header Layout
```
┌─────────────────────────────────────────────────────────┐
│ [Avatar] [Name] [Status]                    [Timestamp] │
│          [Role at Company]                              │
└─────────────────────────────────────────────────────────┘
```

### Avatar Generation
- Uses `getCitizenImage(name, gender)` function
- Generates gender-appropriate avatars
- Consistent with other app components
- Fallback to default if citizen info unavailable

### Status Indicators
- **🟢 Online**: Green background, "Online" text
- **⚫ Offline**: Gray background, "Offline" text
- Only shown when `citizenIsOnline` is defined

## 🔄 Backward Compatibility

The implementation maintains backward compatibility:
- Posts without citizen information still display
- Falls back to `author` field if `citizenName` unavailable
- Graceful handling of missing citizen data
- No breaking changes to existing functionality

## 🧪 Testing

Use the test script to verify functionality:
```bash
node scripts/testCitizenDisplay.js
```

This script tests:
- Post generation with citizen information
- API endpoints returning citizen data
- Database saving with citizen attributes
- Visual display consistency

## 📱 Platform-Specific Examples

### LinkedIn Post
```
┌─────────────────────────────────────────────────────────┐
│ ┌─────┐ Sarah Johnson                    🟢 Online  1h ago│
│ │ 👤  │ Software Engineer at TechCorp Inc                │
│ └─────┘                                                   │
│                                                         │
│ Thrilled to share that our Software Engineer team at    │
│ TechCorp Inc just delivered a major project milestone!  │
│                                                         │
│ Key takeaways from this project:                        │
│ • collaboration is key to success                       │
│ • data-driven decisions lead to better outcomes         │
│                                                         │
│ What challenges have you faced in technology recently?  │
│ I'd love to hear your thoughts in the comments below. 👇│
│                                                         │
│ #ProfessionalGrowth #TeamWork #technology #Leadership   │
│                                                         │
│ ❤️ 12  💬 3  🔄 1                                        │
└─────────────────────────────────────────────────────────┘
```

### TikTok Post
```
┌─────────────────────────────────────────────────────────┐
│ ┌─────┐ Sarah Johnson                    🟢 Online  30m ago│
│ │ 👤  │ Software Engineer at TechCorp Inc                │
│ └─────┘                                                   │
│                                                         │
│ POV: You're a Software Engineer and just discovered     │
│ the secret to productivity 🚀 #ProductivityHacks        │
│                                                         │
│ ❤️ 1.2K  💬 89  🔄 45                                    │
└─────────────────────────────────────────────────────────┘
```

### Instagram Post
```
┌─────────────────────────────────────────────────────────┐
│ ┌─────┐ Sarah Johnson                    🟢 Online  2h ago│
│ │ 👤  │ Software Engineer at TechCorp Inc                │
│ └─────┘                                                   │
│                                                         │
│ Behind the scenes of a Software Engineer life at        │
│ TechCorp Inc ✨ #BehindTheScenes #WorkLife              │
│                                                         │
│ ❤️ 89  💬 15  🔄 8                                       │
└─────────────────────────────────────────────────────────┘
```

This implementation ensures that social media posts display citizen information consistently with the rest of the app, providing a cohesive user experience and making it easy to identify who posted what content.
