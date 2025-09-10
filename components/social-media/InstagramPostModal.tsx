'use client'

import { useState } from 'react'
import { X, Send, Hash, Camera } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import Button from '../buttons/button'

interface InstagramPostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostCreated: () => void
}

export default function InstagramPostModal({ isOpen, onClose, onPostCreated }: InstagramPostModalProps) {
  const { profile, loading: profileLoading } = useProfile()
  const [content, setContent] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [hashtagError, setHashtagError] = useState('')

  // Validate hashtags format
  const validateHashtags = (hashtagString: string): boolean => {
    if (!hashtagString.trim()) return true // Empty is valid
    
    // Check for invalid characters (only allow letters, numbers, and commas)
    const invalidChars = /[^a-z0-9,#]/g
    if (invalidChars.test(hashtagString)) {
      setHashtagError('Hashtags can only contain letters, numbers, and commas')
      return false
    }
    
    // Check for multiple consecutive commas
    if (hashtagString.includes(',,')) {
      setHashtagError('Cannot have multiple commas in a row')
      return false
    }
    
    // Check for hashtags that are too long
    const hashtagList = hashtagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    const tooLong = hashtagList.some(tag => tag.length > 30)
    if (tooLong) {
      setHashtagError('Each hashtag must be 30 characters or less')
      return false
    }
    
    // Check for empty hashtags (just commas)
    if (hashtagString.endsWith(',') || hashtagString.startsWith(',')) {
      setHashtagError('Hashtags cannot start or end with a comma')
      return false
    }
    
    setHashtagError('')
    return true
  }

  // Handle hashtag input with real-time validation and formatting
  const handleHashtagChange = (value: string) => {
    // Remove spaces and convert to lowercase for consistency
    const formattedValue = value.replace(/\s/g, '').toLowerCase()
    setHashtags(formattedValue)
    validateHashtags(formattedValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('Please enter post content')
      return
    }

    if (!profile) {
      setError('User profile not loaded. Please try again.')
      return
    }

    // Validate hashtags before submission
    if (!validateHashtags(hashtags)) {
      setError('Please fix the hashtag format errors above')
      return
    }

    setIsSubmitting(true)
    setError('')
    setHashtagError('')

    try {
      const hashtagArray = hashtags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`)

      const response = await fetch('/api/instagram-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          hashtags: hashtagArray,
          citizenId: profile.id
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Reset form
        setContent('')
        setHashtags('')
        setError('')
        setHashtagError('')
        
        // Close modal and refresh posts
        onClose()
        onPostCreated()
      } else {
        setError(data.error || 'Failed to create post')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Error creating Instagram post:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setContent('')
      setHashtags('')
      setError('')
      setHashtagError('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Camera className="h-5 w-5 text-pink-600" />
            Create Instagram Post
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Post Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your visual story with the world..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              rows={6}
              maxLength={2200}
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {content.length}/2200 characters
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="h-4 w-4 inline mr-1" />
              Hashtags (optional)
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => handleHashtagChange(e.target.value)}
              placeholder="photography,art,creative,instagood"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                hashtagError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            <div className="text-sm text-gray-500 mt-1">
              Separate hashtags with commas (no spaces). We'll add # automatically.
            </div>
            {hashtagError && (
              <div className="text-sm text-red-600 mt-1">
                {hashtagError}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              onClick={() => {}}
              type="submit"
              disabled={isSubmitting || !content.trim() || !profile || profileLoading || !!hashtagError}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Post
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
