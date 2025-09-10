import { Citizen } from '@/types/citizens'

export const getCitizenImage = (name: string, gender: 'male' | 'female') => {
  return `https://avatar.iran.liara.run/public/${gender === 'male' ? 'boy' : 'girl'}?username=${getFirstName(name)}`
}

const getFirstName = (name: string) => {
  return name.split(' ')[0]
}

/**
 * Fetch citizen data by ID
 * @param citizenId The ID of the citizen to fetch
 * @returns Promise<Citizen | null> The citizen data or null if not found
 */
export const fetchCitizenById = async (citizenId: string): Promise<Citizen | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/citizens/${citizenId}`)
    
    if (!response.ok) {
      console.error(`Failed to fetch citizen ${citizenId}: HTTP ${response.status}`)
      return null
    }
    
    const data = await response.json()
    
    if (!data.success || !data.citizen) {
      console.error(`Citizen ${citizenId} not found`)
      return null
    }
    
    return data.citizen
  } catch (error) {
    console.error(`Error fetching citizen ${citizenId}:`, error)
    return null
  }
}

/**
 * Fetch multiple citizens by their IDs
 * @param citizenIds Array of citizen IDs to fetch
 * @returns Promise<Citizen[]> Array of citizen data
 */
export const fetchCitizensByIds = async (citizenIds: string[]): Promise<Citizen[]> => {
  try {
    const citizens = await Promise.all(
      citizenIds.map(id => fetchCitizenById(id))
    )
    
    // Filter out null values
    return citizens.filter((citizen): citizen is Citizen => citizen !== null)
  } catch (error) {
    console.error('Error fetching citizens by IDs:', error)
    return []
  }
}