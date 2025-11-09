import { LevelDefinition, UserLevel } from '@/types/user';
import { Trophy, Star, Sparkles, Zap, Target, Crown, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import NoRank from '@/assets/icons/no_rank.svg'
import Rank1 from '@/assets/icons/rank_1.svg'
import Rank2 from '@/assets/icons/rank_2.svg'
import Rank3 from '@/assets/icons/rank_3.svg'
import Rank4 from '@/assets/icons/rank_4.svg'
import Rank5 from '@/assets/icons/rank_5.svg'
import Rank6 from '@/assets/icons/rank_6.svg'
import { CustomIcon } from '@/components/ui/custom-icon'
import { USER_LEVELS } from '@/constants/levels'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'

interface LevelBadgeProps {
  current: LevelDefinition
  showIcon?: boolean
  showTitle?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LEVEL_STYLES = {
  [UserLevel.NoRank]: {
    bgColor: 'bg-slate-100 dark:bg-slate-800/30',
    textColor: 'text-slate-800 dark:text-slate-300',
    icon: NoRank,
  },
  [UserLevel.Beginner]: {
    bgColor:
      'bg-gradient-to-r from-amber-700/10 to-orange-700/10 dark:from-amber-700/20 dark:to-orange-700/20',
    textColor: 'text-amber-900 dark:text-amber-400',
    icon: Rank1,
  },
  [UserLevel.Elementary]: {
    bgColor:
      'bg-gradient-to-r from-slate-200 to-gray-200 dark:from-slate-700/30 dark:to-gray-700/30',
    textColor: 'text-slate-700 dark:text-slate-300',
    icon: Rank2,
  },
  [UserLevel.Intermediate]: {
    bgColor:
      'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-700/30 dark:to-yellow-700/30',
    textColor: 'text-amber-700 dark:text-amber-300',
    icon: Rank3,
  },
  [UserLevel.UpperIntermediate]: {
    bgColor:
      'bg-gradient-to-r from-rose-100 to-red-100 dark:from-rose-950/30 dark:to-red-900/30',
    textColor: 'text-rose-700 dark:text-rose-300',
    icon: Rank4,
  },
  [UserLevel.Advanced]: {
    bgColor:
      'bg-gradient-to-r from-slate-100 to-sky-100 dark:from-slate-800/30 dark:to-sky-900/30',
    textColor: 'text-sky-700 dark:text-sky-300',
    icon: Rank5,
  },
  [UserLevel.Proficient]: {
    bgColor:
      'bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    icon: Rank6,
  },
}

const SIZES = {
  sm: {
    badge: 'px-2 py-1 text-xs',
    icon: 'h-3 w-3',
  },
  md: {
    badge: 'px-2.5 py-1.5 text-sm',
    icon: 'h-4 w-4',
  },
  lg: {
    badge: 'px-3 py-2 text-base',
    icon: 'h-5 w-5',
  },
}

export function LevelBadge({
  current,
  showIcon = true,
  showTitle = true,
  size = 'md',
  className,
}: LevelBadgeProps) {
  const { t: tCommon } = useTranslationWithHTMLParser(I18N_NAMESPACES.COMMON)
  const style = LEVEL_STYLES[current?.level]
  const sizeStyle = SIZES[size]
  const Icon = style.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium h-full text-nowrap',
        style.bgColor,
        style.textColor,
        sizeStyle.badge,
        className
      )}
    >
      {showIcon && <CustomIcon icon={Icon} size={24} />}
      {showTitle && <>{tCommon(`ranking_define.${current.key}.title`)}</>}
    </span>
  )
}
