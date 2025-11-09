import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Smile } from 'lucide-react'
import { POPULAR_EMOJIS } from '@/constants/emojis'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  className?: string
  buttonSize?: 'sm' | 'md' | 'lg'
}

export function EmojiPicker({ onEmojiSelect, className = '', buttonSize = 'md' }: EmojiPickerProps) {
  const buttonSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10'
  }

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={`${buttonSizeClasses[buttonSize]} ${className}`}
        >
          <Smile className={iconSizeClasses[buttonSize]} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2">
        <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
          {POPULAR_EMOJIS.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onEmojiSelect(emoji)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg transition-colors"
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
