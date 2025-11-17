'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Zap } from 'lucide-react'

export function AIPredictions() {
  const predictions = [
    {
      date: 'Next Monday',
      prediction: '92% attendance',
      confidence: 98,
      reason: 'Regular school day',
      status: 'high',
    },
    {
      date: 'Next Friday',
      prediction: '78% attendance',
      confidence: 94,
      reason: 'Weekend effect expected',
      status: 'low',
    },
    {
      date: 'Holiday Week',
      prediction: '55% attendance',
      confidence: 91,
      reason: 'Extended holiday detected',
      status: 'critical',
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Predictions
        </CardTitle>
        <CardDescription>Next 7 days forecast</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.map((pred, index) => (
            <div key={index} className="p-3 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-sm text-foreground">{pred.date}</p>
                <Badge 
                  variant={pred.status === 'critical' ? 'destructive' : pred.status === 'low' ? 'secondary' : 'default'}
                  className="text-xs"
                >
                  {pred.confidence}% sure
                </Badge>
              </div>
              <p className="text-xl font-bold text-primary mb-2">{pred.prediction}</p>
              <p className="text-xs text-muted-foreground flex items-start gap-1">
                <Zap className="w-3 h-3 mt-0.5 flex-shrink-0 text-accent" />
                {pred.reason}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
