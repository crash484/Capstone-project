'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { AttendanceChart } from '@/components/attendance-chart'
import { AIPredictions } from '@/components/ai-predictions'
import { DataUpload } from '@/components/data-upload'
import { MetricsCards } from '@/components/metrics-cards'
import { Upload, BarChart3, Brain, Settings } from 'lucide-react'

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-4xl font-bold text-foreground">AttendanceAI</h1>
          <p className="text-muted-foreground">AI-powered student attendance analytics and predictions</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="gap-2"
            size="lg"
          >
            <Upload className="w-4 h-4" />
            Upload Data
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            size="lg"
          >
            <BarChart3 className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="mb-8">
          <MetricsCards />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Charts Section */}
          <div className="lg:col-span-2">
            <AttendanceChart />
          </div>

          {/* AI Insights Section */}
          <div className="lg:col-span-1">
            <AIPredictions />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Holiday Pattern Analysis
              </CardTitle>
              <CardDescription>AI-detected patterns in student absences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-foreground">Pattern 1: Weekend Effect</p>
                  <p className="text-xs text-muted-foreground mt-1">Absences spike 23% on Fridays before extended weekends</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-foreground">Pattern 2: Seasonal Holidays</p>
                  <p className="text-xs text-muted-foreground mt-1">Detected major holidays correlating with 45% absence rate</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-foreground">Pattern 3: Midweek Dips</p>
                  <p className="text-xs text-muted-foreground mt-1">Wednesday shows consistent 12% lower attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Predictive Alerts</CardTitle>
              <CardDescription>Upcoming attendance risks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="w-2 h-2 rounded-full bg-destructive mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">High Risk</p>
                    <p className="text-xs text-muted-foreground">Next holiday week predicted 40% absence rate</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Medium Risk</p>
                    <p className="text-xs text-muted-foreground">Friday sessions typically see more absences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-muted/20">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Monitoring</p>
                    <p className="text-xs text-muted-foreground">Tuesday attendance stable and predictable</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Data Upload Dialog */}
      {isUploadOpen && (
        <DataUpload onClose={() => setIsUploadOpen(false)} />
      )}
    </div>
  )
}
