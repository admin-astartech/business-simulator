'use client'

import { Box, Typography, Card, CardContent } from '@mui/material'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { CitizenAnalytics } from '@/types/analytics'

interface ChartsSectionProps {
  analytics: CitizenAnalytics
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function ChartsSection({ analytics }: ChartsSectionProps) {
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
      gap: 3
    }}>
      {/* Age Distribution */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Age Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageRange" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Role Distribution */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Role Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.roleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ role }) => role}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


    </Box>
  )
}
