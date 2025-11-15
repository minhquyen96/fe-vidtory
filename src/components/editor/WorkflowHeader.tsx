import React from 'react'
import { Lightbulb, Trash2, FolderOpen, Save, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CustomIcon } from '../ui/custom-icon'
import LogoIcon from '@/assets/icons/logo.svg'

interface WorkflowHeaderProps {
  onLoadExample?: () => void
  onClear?: () => void
  onLoad?: () => void
  onSave?: () => void
  onRunWorkflow?: () => void
}

export function WorkflowHeader({
  onLoadExample,
  onClear,
  onLoad,
  onSave,
  onRunWorkflow,
}: WorkflowHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left side - Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center">
          {/* <span className="text-white font-bold text-lg">AI</span> */}
          <CustomIcon icon={LogoIcon} className="w-32 h-10" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">AI Workflow Builder</h1>
          <p className="text-xs text-gray-500">Visual workflow canvas prototype</p>
        </div>
      </div>

      {/* Right side - Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onLoadExample}
          className="gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          Load Example
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onLoad}
          className="gap-2"
        >
          <FolderOpen className="w-4 h-4" />
          Load
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onRunWorkflow}
          className="gap-2 bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Play className="w-4 h-4" />
          Run Workflow
        </Button>
      </div>
    </header>
  )
}

