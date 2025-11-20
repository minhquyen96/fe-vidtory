import React from 'react'
import { Search, Upload, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'

export function DashboardHeader() {
  const router = useRouter()

  const handleNewWorkflow = () => {
    router.push('/editor')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search workflows..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(171,223,0)] focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <Button
          size="sm"
          onClick={handleNewWorkflow}
          className="gap-2 bg-[rgb(171,223,0)] hover:bg-[rgb(171,223,0)]/90 text-gray-900"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </Button>
      </div>
    </header>
  )
}

