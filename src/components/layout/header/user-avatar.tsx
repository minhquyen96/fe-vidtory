import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  avatar?: string
  avatarFrame?: string
  classNames?: string
  premium?: boolean
}

export function UserAvatar({ avatar, avatarFrame, classNames, premium }: UserAvatarProps) {
  return (
    <Avatar className={cn('relative', classNames)}>
      {avatar ? (
        <AvatarImage src={avatar} alt="User avatar" />
      ) : (
        <AvatarFallback>U</AvatarFallback>
      )}
      {premium && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-background" />
      )}
    </Avatar>
  )
}

