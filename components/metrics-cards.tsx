'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, AlertCircle } from 'lucide-react'

export function MetricsCards() {
  const metrics = [
    {
      label: 'Average Attendance',
      value: '87.5%',
      change: '+2.3%',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'Total Students',
      value: '285',
      change: 'Active',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'At Risk Students',
      value: '23',
      change: '-1 from last week',
      isPositive: true,
      icon: AlertCircle,
    },
    {
      label: 'Prediction Accuracy',
      value: '94.2%',
      change: '+3.1%',
      isPositive: true,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className="hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{metric.value}</p>
                  <p className={`text-xs mt-2 flex items-center gap-1 ${metric.isPositive ? 'text-accent' : 'text-destructive'}`}>
                    {metric.isPositive ? '↑' : '↓'} {metric.change}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
