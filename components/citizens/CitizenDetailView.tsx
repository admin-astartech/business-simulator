import { useState } from 'react'
import { Citizen } from '@/types/citizens'
import CitizenChatModal from './CitizenChatModal'
import { getCitizenImage } from '@/lib/citizen'
import Image from 'next/image'

interface CitizenDetailViewProps {
  citizen: Citizen
  onBack: () => void
}

export default function CitizenDetailView({ citizen, onBack }: CitizenDetailViewProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleOpenChat = () => {
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Citizens
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Citizen Details</h2>
          <button
            onClick={handleOpenChat}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className={`h-16 w-16 rounded-full ${citizen.avatarColor} flex items-center justify-center mr-4`}>
              <Image src={getCitizenImage(citizen.name, citizen.gender)} alt={citizen.name} width={64} height={64} />   
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{citizen.name}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  citizen.isOnline 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {citizen.isOnline ? '🟢 Online' : '⚫ Offline'}
                </span>
              </div>
              <p className="text-lg text-gray-600">{citizen.role} at {citizen.company}</p>
              <p className="text-sm text-gray-500">#{citizen.id} • {citizen.age} years old</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-sm text-gray-900">{citizen.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Bank Balance</h3>
              <p className="text-sm font-medium text-green-600">£{citizen.monetaryValue.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Company</h3>
              <p className="text-sm text-gray-900">{citizen.company}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Gender</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                citizen.gender === 'male' 
                  ? 'bg-blue-100 text-blue-800' 
                  : citizen.gender === 'female'
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {citizen.gender || 'Unknown'}
              </span>
            </div>
            <div className={`p-4 rounded-lg ${
              citizen.isOnline ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-2 ${
                  citizen.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <p className={`text-sm font-medium ${
                  citizen.isOnline ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {citizen.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
              {citizen.lastSeen && (
                <p className="text-xs text-gray-400 mt-1">
                  Last seen: {new Date(citizen.lastSeen).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Personality Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personality Profile</h2>
          
          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Summary</h3>
            <p className="text-sm text-blue-800">{citizen.personality.summary}</p>
          </div>

          {/* Core Personality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Traits */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Key Traits</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.strengths.map((strength, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* Work Style */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Work Style</h3>
              <p className="text-sm text-gray-700">{citizen.personality.workStyle}</p>
            </div>

            {/* Social Style */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Social Style</h3>
              <p className="text-sm text-gray-700">{citizen.personality.socialStyle}</p>
            </div>

            {/* Motivation */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Motivation</h3>
              <p className="text-sm text-gray-700">{citizen.personality.motivation}</p>
            </div>

            {/* Risk Tolerance */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Risk Tolerance</h3>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${citizen.personality.riskTolerance * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-700">
                  {Math.round(citizen.personality.riskTolerance * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Interests & Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Interests */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Likes */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Likes</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.likes.map((like, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                  >
                    {like}
                  </span>
                ))}
              </div>
            </div>

            {/* Values */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Values</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.values.map((value, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.preferences.map((preference, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"
                  >
                    {preference}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Goals & Aspirations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Goals */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Goals</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.goals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>

            {/* Aspirations */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Aspirations</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.aspirations.map((aspiration, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full"
                  >
                    {aspiration}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Challenges & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Challenges */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Challenges</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.challenges.map((challenge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                  >
                    {challenge}
                  </span>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Weaknesses</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.weaknesses.map((weakness, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                  >
                    {weakness}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Beliefs & Fears */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Beliefs */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Beliefs</h3>
              <div className="space-y-2">
                {citizen.personality.beliefs.map((belief, index) => (
                  <p key={index} className="text-sm text-gray-700 italic">"{belief}"</p>
                ))}
              </div>
            </div>

            {/* Fears */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Fears</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.fears.map((fear, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                  >
                    {fear}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dislikes & Frustrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Dislikes */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Dislikes</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.dislikes.map((dislike, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                  >
                    {dislike}
                  </span>
                ))}
              </div>
            </div>

            {/* Frustrations */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Frustrations</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.frustrations.map((frustration, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                  >
                    {frustration}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Behaviors & Patterns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Behaviors */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Behaviors</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.behaviors.map((behavior, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full"
                  >
                    {behavior}
                  </span>
                ))}
              </div>
            </div>

            {/* Patterns */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Patterns</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.patterns.map((pattern, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-violet-100 text-violet-800 text-xs font-medium rounded-full"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Triggers & Reactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Triggers */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Triggers</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.triggers.map((trigger, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </div>

            {/* Reactions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Reactions</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.reactions.map((reaction, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full"
                  >
                    {reaction}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Responses & Motivations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Responses */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Responses</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.responses.map((response, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {response}
                  </span>
                ))}
              </div>
            </div>

            {/* Motivations */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Motivations</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.motivations.map((motivation, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                  >
                    {motivation}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Habits */}
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Habits</h3>
              <div className="flex flex-wrap gap-2">
                {citizen.personality.habits.map((habit, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-full"
                  >
                    {habit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stress Triggers */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-900 mb-3">Stress Triggers</h3>
            <div className="flex flex-wrap gap-2">
              {citizen.personality.stressTriggers.map((trigger, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full"
                >
                  {trigger}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <CitizenChatModal
        open={isChatOpen}
        onClose={handleCloseChat}
        citizen={citizen}
      />
    </div>
  )
}
