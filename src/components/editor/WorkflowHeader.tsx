import React, { useState, useRef, useEffect } from 'react'
import { Lightbulb, Trash2, FolderOpen, Save, Play, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CustomIcon } from '../ui/custom-icon'
import LogoIcon from '@/assets/icons/logo.svg'
import { useRouter } from 'next/router'

interface WorkflowHeaderProps {
  workflowTitle?: string
  onTitleChange?: (title: string) => void
  onBack?: () => void
  onLoadExample?: () => void
  onClear?: () => void
  onLoad?: () => void
  onSave?: () => void
  onRunWorkflow?: () => void
}

export function WorkflowHeader({
  workflowTitle = 'Untitled Workflow',
  onTitleChange,
  onBack,
  onLoadExample,
  onClear,
  onLoad,
  onSave,
  onRunWorkflow,
}: WorkflowHeaderProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(workflowTitle)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTitle(workflowTitle)
  }, [workflowTitle])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleTitleClick = () => {
    setIsEditing(true)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    onTitleChange?.(title)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      setTitle(workflowTitle)
      setIsEditing(false)
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left side - Back button, Logo, and Title */}
      <div className="flex items-center gap-4">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />
        
        {/* Logo */}
        <div className="flex items-center justify-center">
          <CustomIcon icon={LogoIcon} className="w-32 h-10" />
        </div>
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />
        
        {/* Editable Title */}
        <div className="flex items-center">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-[rgb(171,223,0)] outline-none px-1 min-w-[200px]"
            />
          ) : (
            <button
              onClick={handleTitleClick}
              className="text-lg font-semibold text-gray-900 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors cursor-text"
            >
              {title || 'Untitled Workflow'}
            </button>
          )}
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
          className="gap-2 bg-primary text-neutral-600"
        >
          <Play className="w-4 h-4" />
          Run Workflow
        </Button>
      </div>
    </header>
  )
}

