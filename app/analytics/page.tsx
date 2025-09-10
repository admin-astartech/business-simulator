'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material'
import { Refresh, Analytics } from '@mui/icons-material'
import { CitizenAnalytics } from '@/types/analytics'
import OverviewCards from '@/components/analytics/OverviewCards'
import ChartsSection from '@/components/analytics/ChartsSection'
import TopPerformersTable from '@/components/analytics/TopPerformersTable'
import ConversationInsights from '@/components/analytics/ConversationInsights'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<CitizenAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState(0)

  const loadAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column'
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading analytics data...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={loadAnalytics}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    )
  }

  if (!analytics) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No analytics data available
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Analytics sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Citizen Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive insights into your citizen population
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadAnalytics}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Overview Cards */}
      <OverviewCards analytics={analytics} />

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Demographics" />
            <Tab label="Performance" />
            <Tab label="Engagement" />
          </Tabs>
        </Box>

        {/* Demographics Tab */}
        <TabPanel value={tabValue} index={0}>
          <ChartsSection analytics={analytics} />
        </TabPanel>

        {/* Performance Tab */}
        <TabPanel value={tabValue} index={1}>
          <TopPerformersTable performers={analytics.topPerformers} />
        </TabPanel>

        {/* Engagement Tab */}
        <TabPanel value={tabValue} index={2}>
          <ConversationInsights 
            conversationStats={analytics.conversationStats}
            engagementMetrics={analytics.engagementMetrics}
          />
        </TabPanel>
      </Card>
    </Box>
  )
}
