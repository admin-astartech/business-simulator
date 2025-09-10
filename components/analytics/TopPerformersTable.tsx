'use client'

import { 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  Box
} from '@mui/material'
import { AttachMoney, Message, TrendingUp } from '@mui/icons-material'
import { TopPerformer } from '@/types/analytics'

interface TopPerformersTableProps {
  performers: TopPerformer[]
}

export default function TopPerformersTable({ performers }: TopPerformersTableProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top Performers
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Company</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="right">Conversations</TableCell>
                <TableCell align="right">Engagement</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {performers.map((performer, index) => (
                <TableRow key={performer.id} hover>
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
                        {performer.name.split(' ').map(n => n[0]).join('')}
                      </Box>
                      {performer.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={performer.role} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>{performer.company}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <AttachMoney sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                      {performer.monetaryValue.toLocaleString()}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Message sx={{ fontSize: 16, mr: 0.5, color: 'info.main' }} />
                      {performer.conversationCount}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5, color: 'warning.main' }} />
                      {performer.engagementScore}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
