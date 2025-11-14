import React from 'react'
import { Workflow, ArrowLeftRight, Settings, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WelcomeCardProps {
  onLoadExample?: () => void
}

export function WelcomeCard({ onLoadExample }: WelcomeCardProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <Card className="w-full max-w-2xl mx-4 shadow-lg pointer-events-auto">
        <CardContent className="p-8">
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="relative">
                {/* Main icon with connected nodes */}
                <div className="w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center relative">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Connection line */}
                    <path
                      d="M 8 20 Q 20 20 32 20"
                      stroke="#60a5fa"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* Left node */}
                    <rect x="4" y="16" width="8" height="8" rx="1" fill="#60a5fa" />
                    {/* Right node */}
                    <rect x="28" y="16" width="8" height="8" rx="1" fill="#60a5fa" />
                  </svg>
                </div>
                {/* Sparkle icon */}
                <div className="absolute -top-1 -right-1">
                  <div className="w-5 h-5 rounded-full bg-blue-400 dark:bg-blue-500 flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 0L6.5 4.5L11 5L6.5 5.5L6 10L5.5 5.5L1 5L5.5 4.5L6 0Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              AI Visual Workflow Builder
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Build AI-powered visual creation workflows with an intuitive node-based canvas.
            </p>
          </div>

          {/* Instructional Steps */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Click a node type in the left panel to add it to the canvas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Connect nodes by dragging from an output port to an input port.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Configure parameters in the inspector and run your workflow.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

          {/* Tip Section */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Try clicking{' '}
                <button
                  onClick={onLoadExample}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  'Load Example'
                </button>{' '}
                in the toolbar to see a pre-built workflow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

