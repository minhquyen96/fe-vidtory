import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { 
  Home, 
  Workflow, 
  Clock, 
  Sparkles, 
  Book, 
  Settings,
  ChevronDown,
  Play,
  User,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { CustomIcon } from '../ui/custom-icon'
import LogoIcon from '@/assets/icons/logo.svg'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'workflows', label: 'My Workflows', icon: Workflow, path: '/dashboard/workflows' },
  { id: 'history', label: 'History', icon: Clock, path: '/dashboard/history' },
]

const resourcesItems = [
  { id: 'templates', label: 'Templates', icon: Sparkles, path: '/dashboard/templates' },
  { id: 'documentation', label: 'Documentation', icon: Book, path: '/dashboard/documentation' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
]

export function DashboardSidebar() {
  const router = useRouter()
  const { openLoginModal, user, userData, logout } = useAuth()

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return router.pathname === '/dashboard'
    }
    return router.pathname.startsWith(path)
  }

  const getUserDisplayName = () => {
    return userData?.displayName || 
           userData?.name || 
           user?.displayName || 
           user?.email?.split('@')[0] || 
           'User'
  }

  const getUserInitial = () => {
    const name = getUserDisplayName()
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
        <CustomIcon icon={LogoIcon} className="w-32 h-10" />
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        {user ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={userData?.photoURL || user.photoURL || undefined}
                    alt={getUserDisplayName()}
                  />
                  <AvatarFallback className="bg-[rgb(171,223,0)] text-white">
                    {getUserInitial()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500">Personal</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-2">
              <div className="flex flex-col space-y-1">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900">My Account</p>
                </div>
                <div className="border-t" />
                <Button
                  variant="ghost"
                  className="justify-start w-full"
                  onClick={() => router.push('/dashboard/settings')}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-3"
            onClick={() => openLoginModal()}
          >
            <span className="text-sm font-medium">Login</span>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.id}
                href={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  active
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Resources Section */}
        <div className="mt-8">
          <div className="px-3 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Resources
            </span>
          </div>
          <nav className="space-y-1">
            {resourcesItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    active
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Upgrade Card */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-[rgb(171,223,0)] to-blue-500 rounded-lg p-4 text-white">
          <div className="font-semibold text-sm mb-1">Upgrade to Pro</div>
          <div className="text-xs opacity-90 mb-3">
            Unlock unlimited workflows and advanced features.
          </div>
          <button className="w-full bg-white text-gray-900 text-xs font-medium py-2 px-3 rounded-md hover:bg-gray-100 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )
}

