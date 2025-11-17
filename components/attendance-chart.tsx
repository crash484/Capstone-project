'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const data = [
  { date: 'Jan 1', attendance: 92, predicted: 91 },
  { date: 'Jan 2', attendance: 88, predicted: 87 },
  { date: 'Jan 3', attendance: 85, predicted: 86 },
  { date: 'Jan 4', attendance: 79, predicted: 80 },
  { date: 'Jan 5', attendance: 75, predicted: 76 },
  { date: 'Jan 6', attendance: 88, predicted: 87 },
  { date: 'Jan 7', attendance: 91, predicted: 90 },
  { date: 'Jan 8', attendance: 89, predicted: 89 },
  { date: 'Jan 9', attendance: 86, predicted: 85 },
  { date: 'Jan 10', attendance: 82, predicted: 83 },
]

export function AttendanceChart() {
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>Actual vs AI-predicted attendance rates</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={chartType === 'area' ? 'default' : 'outline'}
              onClick={() => setChartType('area')}
            >
              Area
            </Button>
            <Button 
              size="sm" 
              variant={chartType === 'line' ? 'default' : 'outline'}
              onClick={() => setChartType('line')}
            >
              Line
            </Button>
            <Button 
              size="sm" 
              variant={chartType === 'bar' ? 'default' : 'outline'}
              onClick={() => setChartType('bar')}
            >
              Bar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' && (
              <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--color-chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--color-chart-1))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--color-chart-2))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--color-chart-2))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="date" stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--color-card))', border: '1px solid hsl(var(--color-border))' }} />
                <Legend />
                <Area type="monotone" dataKey="attendance" stroke="hsl(var(--color-chart-1))" fillOpacity={1} fill="url(#colorAttendance)" name="Actual Attendance" />
                <Area type="monotone" dataKey="predicted" stroke="hsl(var(--color-chart-2))" fillOpacity={1} fill="url(#colorPredicted)" name="AI Predicted" />
              </AreaChart>
            )}
            {chartType === 'line' && (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="date" stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--color-card))', border: '1px solid hsl(var(--color-border))' }} />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="hsl(var(--color-chart-1))" name="Actual Attendance" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" stroke="hsl(var(--color-chart-2))" name="AI Predicted" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            )}
            {chartType === 'bar' && (
              <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="date" stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--color-card))', border: '1px solid hsl(var(--color-border))' }} />
                <Legend />
                <Bar dataKey="attendance" fill="hsl(var(--color-chart-1))" name="Actual Attendance" />
                <Bar dataKey="predicted" fill="hsl(var(--color-chart-2))" name="AI Predicted" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
