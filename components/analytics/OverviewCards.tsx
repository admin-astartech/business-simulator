'use client'

import { Card, CardContent, Typography, Box } from '@mui/material'
import { TrendingUp, People, Message, AttachMoney } from '@mui/icons-material'
import { CitizenAnalytics } from '@/types/analytics'

interface OverviewCardsProps {
  analytics: CitizenAnalytics
}

export default function OverviewCards({ analytics }: OverviewCardsProps) {
  const cards = [
    {
      title: 'Total Citizens',
      value: analytics.totalCitizens.toLocaleString(),
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main'
    },
    {
      title: 'Average Age',
      value: `${analytics.averageAge} years`,
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main'
    },
    {
      title: 'Total Value',
      value: `$${analytics.monetaryValueStats.total.toLocaleString()}`,
      icon: <AttachMoney sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.main'
    },
    {
      title: 'Active Conversations',
      value: analytics.conversationStats.totalConversations.toLocaleString(),
      icon: <Message sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info.main'
    }
  ]

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
      gap: 2,
      mb: 3
    }}>
      {cards.map((card, index) => (
        <Card key={index} sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {card.icon}
              <Box sx={{ ml: 2 }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
