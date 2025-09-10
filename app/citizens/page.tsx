'use client'

import { useState, useEffect } from 'react'
import { useCitizens } from '@/hooks/useCitizens'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import CitizensStats from '@/components/citizens/CitizensStats'
import CitizensTable from '@/components/citizens/CitizensTable'
import CitizenDetailView from '@/components/citizens/CitizenDetailView'
import { Citizen } from '@/types/citizens'

export default function Citizens() {
  const { data, loading, error, isRefreshing } = useCitizens()
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null)

  // Handle notification clicks
  useEffect(() => {
    const handleNotificationClick = (event: CustomEvent) => {
      const { citizenId, citizenName, type } = event.detail
      
      if (type === 'auto-response' && data?.citizens) {
        // Find the citizen by ID
        const citizen = data.citizens.find(c => c.id === citizenId)
        if (citizen) {
          console.log(`📱 Notification clicked: Opening conversation with ${citizenName}`)
          setSelectedCitizen(citizen)
        }
      }
    }

    // Listen for notification click events
    window.addEventListener('notificationClicked', handleNotificationClick as EventListener)

    return () => {
      window.removeEventListener('notificationClicked', handleNotificationClick as EventListener)
    }
  }, [data?.citizens])

  // const prompt = selectedCitizen ? getCitizenPrompt(selectedCitizen) : null

  // console.log(prompt)
  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <LoadingSpinner message="Loading citizens data..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage message={error} />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <ErrorMessage message="No data available" />
        </div>
      </div>
    )
  }

  const handleCitizenSelect = (citizen: Citizen) => {
    setSelectedCitizen(citizen)
  }

  const handleBackToList = () => {
    setSelectedCitizen(null)
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader isRefreshing={isRefreshing} />
        <CitizensStats totalCitizens={data.totalCitizens} citizens={data.citizens} />
        {selectedCitizen ? (
          <CitizenDetailView citizen={selectedCitizen} onBack={handleBackToList} />
        ) : (
          <CitizensTable citizens={data.citizens} onCitizenSelect={handleCitizenSelect} />
        )}
      </div>
    </div>
  )
}

function PageHeader({ isRefreshing }: { isRefreshing?: boolean }) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Citizens Management
        </h1>
        {isRefreshing && (
          <div className="flex items-center text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Refreshing data...
          </div>
        )}
      </div>
      <p className="text-lg text-gray-600 mb-8">
        Manage and oversee the citizens in your business simulation.
        {isRefreshing && (
          <span className="ml-2 text-sm text-blue-600">
            (Auto-refreshing every minute)
          </span>
        )}
      </p>
    </>
  )
}
