import React, { ReactNode } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 relative">
        {/* Header */}
        <DashboardHeader />

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">{children}</main>
      </div>
    </div>
  )
}
