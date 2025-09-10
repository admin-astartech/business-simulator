import { Citizen } from '@/types/citizens'
import DataTable, { TableColumn } from '@/components/ui/DataTable';
import Image from 'next/image';
import { getCitizenImage } from '@/lib/citizen';
import { useState, useMemo, useRef, useEffect } from 'react';

interface CitizensTableProps {
  citizens: Citizen[]
  onCitizenSelect?: (citizen: Citizen) => void
}

export default function CitizensTable({ citizens, onCitizenSelect }: CitizensTableProps) {
  const [selectedGenders, setSelectedGenders] = useState<Set<string>>(new Set(['male', 'female']))
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['online', 'offline']))
  const [isGenderFilterOpen, setIsGenderFilterOpen] = useState(false)
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false)
  const genderFilterRef = useRef<HTMLDivElement>(null)
  const statusFilterRef = useRef<HTMLDivElement>(null)

  // Filter citizens based on selected genders and statuses
  const filteredCitizens = useMemo(() => {
    let filtered = citizens

    // Filter by gender
    if (selectedGenders.size > 0) {
      filtered = filtered.filter(citizen => selectedGenders.has(citizen.gender))
    }

    // Filter by status
    if (selectedStatuses.size > 0) {
      filtered = filtered.filter(citizen => {
        const status = citizen.isOnline ? 'online' : 'offline'
        return selectedStatuses.has(status)
      })
    }

    return filtered
  }, [citizens, selectedGenders, selectedStatuses])

  const handleGenderToggle = (gender: string) => {
    const newSelectedGenders = new Set(selectedGenders)
    if (newSelectedGenders.has(gender)) {
      newSelectedGenders.delete(gender)
    } else {
      newSelectedGenders.add(gender)
    }
    setSelectedGenders(newSelectedGenders)
  }

  const handleStatusToggle = (status: string) => {
    const newSelectedStatuses = new Set(selectedStatuses)
    if (newSelectedStatuses.has(status)) {
      newSelectedStatuses.delete(status)
    } else {
      newSelectedStatuses.add(status)
    }
    setSelectedStatuses(newSelectedStatuses)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genderFilterRef.current && !genderFilterRef.current.contains(event.target as Node)) {
        setIsGenderFilterOpen(false)
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setIsStatusFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const columns: TableColumn<Citizen>[] = [
    {
      key: 'index',
      header: '#',
      render: (_, index) => index + 1
    },
    {
      key: 'name',
      header: 'Name',
      render: (citizen) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className={`h-8 w-8 rounded-full ${citizen.avatarColor} flex items-center justify-center`}>
              <Image src={getCitizenImage(citizen.name, citizen.gender)} alt={citizen.name} width={32} height={32} />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{citizen.name}</div>
            <div className="text-sm text-gray-500">{citizen.company}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Contact',
      render: (citizen) => citizen.email
    },
    {
      key: 'age',
      header: 'Age',
      render: (citizen) => citizen.age
    },
    {
      key: 'gender',
      header: 'Gender',
      render: (citizen) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          citizen.gender === 'male' 
            ? 'bg-blue-100 text-blue-800' 
            : citizen.gender === 'female'
            ? 'bg-pink-100 text-pink-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {citizen.gender || 'Unknown'}
        </span>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (citizen) => citizen.role
    },
    {
      key: 'isOnline',
      header: 'Status',
      render: (citizen) => (
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full mr-2 ${
            citizen.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <span className={`text-sm font-medium ${
            citizen.isOnline ? 'text-green-600' : 'text-gray-500'
          }`}>
            {citizen.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      )
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Filter Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">All Citizens</h2>
          <div className="flex items-center space-x-3">
            {/* Gender Filter */}
            <div className="relative" ref={genderFilterRef}>
              <button
                onClick={() => setIsGenderFilterOpen(!isGenderFilterOpen)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Gender
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isGenderFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                      Gender Filter
                    </div>
                    <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenders.has('male')}
                        onChange={() => handleGenderToggle('male')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3">Male</span>
                    </label>
                    <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenders.has('female')}
                        onChange={() => handleGenderToggle('female')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3">Female</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative" ref={statusFilterRef}>
              <button
                onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isStatusFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                      Status Filter
                    </div>
                    <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.has('online')}
                        onChange={() => handleStatusToggle('online')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3">Online</span>
                    </label>
                    <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.has('offline')}
                        onChange={() => handleStatusToggle('offline')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3">Offline</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredCitizens}
        columns={columns}
        onRowClick={onCitizenSelect}
        emptyMessage="No citizens found"
      />
    </div>
  )
}
