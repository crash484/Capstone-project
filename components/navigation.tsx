'use client'

import { Button } from '@/components/ui/button'
import { BarChart3, Settings, Menu } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">AttendanceAI</h1>
              <p className="text-xs text-muted-foreground">Analytics & Predictions</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Analytics</Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            className="sm:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-4 flex flex-col gap-2 pt-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
            <Button variant="ghost" className="w-full justify-start">Analytics</Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
