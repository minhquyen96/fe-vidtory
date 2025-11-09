import { UserLevel, LevelDefinition } from '@/types/user'

export const USER_LEVELS: LevelDefinition[] = [
  {
    level: UserLevel.NoRank,
    levelNumber: 0,
    key: 'no_rank',
    minScore: -1,
    maxScore: 0,
  },
  {
    level: UserLevel.Beginner,
    levelNumber: 1,
    key: 'beginner',
    minScore: 0,
    maxScore: 1500,
  },
  {
    level: UserLevel.Elementary,
    levelNumber: 2,
    key: 'elementary',
    minScore: 1501,
    maxScore: 3000,
  },
  {
    level: UserLevel.Intermediate,
    levelNumber: 3,
    key: 'intermediate',
    minScore: 3001,
    maxScore: 5000,
  },
  {
    level: UserLevel.UpperIntermediate,
    levelNumber: 4,
    key: 'upper_intermediate',
    minScore: 5001,
    maxScore: 7000,
  },
  {
    level: UserLevel.Advanced,
    levelNumber: 5,
    key: 'advanced',
    minScore: 7001,
    maxScore: 8500,
  },
  {
    level: UserLevel.Proficient,
    levelNumber: 6,
    key: 'proficient',
    minScore: 8501,
    maxScore: 10000,
  },
]
