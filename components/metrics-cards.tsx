'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export function MetricsCards() {
  const [metrics, setMetrics] = useState(() => [
    {
      label: 'Average Attendance',
      value: '—',
      change: '',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'Total Students',
      value: '—',
      change: 'Active',
      isPositive: true,
      icon: Users,
    },
    {
      label: 'At Risk Students',
      value: '—',
      change: '',
      isPositive: false,
      icon: AlertCircle,
    },
    {
      label: 'Prediction Accuracy',
      value: '—',
      change: '',
      isPositive: true,
      icon: TrendingUp,
    },
  ])

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        // Fetch risk data
        const riskRes = await fetch('/api/ml/risk')
        const riskJson = riskRes.ok ? await riskRes.json() : null

        // Fetch pattern data
        const patternRes = await fetch('/api/ml/patterns')
        const patternJson = patternRes.ok ? await patternRes.json() : null

        if (!mounted) return

        const riskData = riskJson?.data || []
        const patternData = patternJson?.data || {}

        const totalStudents = Array.isArray(riskData) ? riskData.length : 0
        const atRisk = Array.isArray(riskData)
          ? riskData.filter((r: any) => r.risk_level && r.risk_level.toLowerCase() !== 'low').length
          : 0

        const avgAttendance = patternData.overall_mean_attendance

        setMetrics([
          {
            label: 'Average Attendance',
            value: avgAttendance ? `${avgAttendance.toFixed(1)}%` : '—',
            change: '',
            isPositive: true,
            icon: Users,
          },
          {
            label: 'Total Students',
            value: totalStudents.toString(),
            change: 'Active',
            isPositive: true,
            icon: Users,
          },
          {
            label: 'At Risk Students',
            value: atRisk.toString(),
            change: '',
            isPositive: atRisk === 0,
            icon: AlertCircle,
          },
          {
            label: 'Prediction Accuracy',
            value: 'N/A',
            change: '',
            isPositive: true,
            icon: TrendingUp,
          },
        ])
      } catch (err) {
        console.error('Failed to fetch metrics data:', err)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [])

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
