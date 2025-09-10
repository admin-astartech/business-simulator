'use client'

import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip
} from '@mui/material'
import { Message, TrendingUp, People, Schedule } from '@mui/icons-material'
import { ConversationStats, EngagementMetrics } from '@/types/analytics'

interface ConversationInsightsProps {
  conversationStats: ConversationStats
  engagementMetrics: EngagementMetrics
}

export default function ConversationInsights({ 
  conversationStats, 
  engagementMetrics 
}: ConversationInsightsProps) {
  const insightCards = [
    {
      title: 'Total Conversations',
      value: conversationStats.totalConversations.toLocaleString(),
      icon: <Message sx={{ fontSize: 32, color: 'primary.main' }} />,
      description: 'Active conversation threads'
    },
    {
      title: 'Total Messages',
      value: conversationStats.totalMessages.toLocaleString(),
      icon: <Message sx={{ fontSize: 32, color: 'success.main' }} />,
      description: 'All messages exchanged'
    },
    {
      title: 'Avg Messages/Conversation',
      value: conversationStats.averageMessagesPerConversation.toFixed(1),
      icon: <TrendingUp sx={{ fontSize: 32, color: 'warning.main' }} />,
      description: 'Average conversation depth'
    },
    {
      title: 'Engagement Rate',
      value: `${engagementMetrics.engagementRate.toFixed(1)}%`,
      icon: <People sx={{ fontSize: 32, color: 'info.main' }} />,
      description: 'Citizens actively engaged'
    }
  ]

  return (
    <Box>
      {/* Insight Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 3
      }}>
        {insightCards.map((card, index) => (
          <Card key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {card.icon}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Most Active Citizens */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Most Active Citizens
          </Typography>
          {conversationStats.mostActiveCitizens.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Messages</TableCell>
                    <TableCell align="right">Last Active</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {conversationStats.mostActiveCitizens.map((citizen, index) => (
                    <TableRow key={citizen.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              fontSize: '0.875rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {citizen.name.split(' ').map(n => n[0]).join('')}
                          </Box>
                          {citizen.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={citizen.role} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Message sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                          {citizen.messageCount}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          {new Date(citizen.lastActive).toLocaleDateString()}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4, 
              color: 'text.secondary' 
            }}>
              <Message sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                No conversation data available
              </Typography>
              <Typography variant="body2">
                Start chatting with citizens to see engagement insights
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
