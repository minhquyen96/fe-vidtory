export const SWRCacheKeyGetters = {
  vocabularyReviews: () => '/user/vocabulary-reviews',
  // User
  userInfo: (userId?: string) =>
    userId ? `/user/info/${userId}` : `/user/info`,
  userStats: (userId?: string) =>
    userId ? `/user/stats/${userId}` : `/user/stats`,
  userLessonProgress: (userId?: string) =>
    userId ? `/user/lesson-progress/${userId}` : `/user/lesson-progress`,
  userRankingHistory: (userId?: string) =>
    userId ? `/user/ranking-history/${userId}` : `/user/ranking-history`,
  userProgress: (lessonIds: string[]) => `/user/lesson-progress/${lessonIds}`,
  userCompletedSentences: (lessonId: string) =>
    `/user/completed-sentences/${lessonId}`,
  // Public Profile - combines info, stats, and ranking history
  publicProfile: (userId: string) => `/user/info/${userId}`,

  // Review
  reviewSentences: (userId: string) => `/sentences/review/${userId}`,
  reviewSentencesCount: (userId: string) => `/sentences/review/${userId}/count`,

  // Note
  sentenceNotes: (lesson_id?: string) =>
    lesson_id ? `/sentence-notes?lesson_id=${lesson_id}` : `/sentence-notes`,

  // Shop
  purchasedItems: () => `/shop/items/purchased`,

  // Lesson
  lessonsByTopic: (topicId: string) => `/lessons?topic_id=${topicId}`,
  lessonsProgressByTopic: (topicId: string) =>
    `/lessons/progress?topic_id=${topicId}`,
  nextLessonSuggestion: (lessonId: string) =>
    `/lessons/suggest?lesson_id=${lessonId}`,

  // Vocabulary/Decks
  decks: (params?: { page?: number; limit?: number; search?: string }) =>
    `/vocabulary/decks?${new URLSearchParams(
      Object.entries(params || {})
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString()}`,
  deckById: (deckId: string) => `/vocabulary/deck/${deckId}`,
  deckGroups: (deckId: string) => `/vocabulary/deck/${deckId}/groups`,
  groupsProgress: (deckId: string) =>
    `/learning-vocabulary/groups-progress/${deckId}`,
  vocabularyStats: () => `/learning-vocabulary/stats`,
  vocabularyCurrentSession: () => `/learning-vocabulary/session/current`,
  vocabularySessionHistory: () => `/learning-vocabulary/session/history`,
  vocabularyLeaderboard: (month: string) =>
    `/leaderboard/monthly?month=${month}&sortBy=vocabulary`,
  leaderboard: (month: string) => `/leaderboard/monthly?month=${month}`,
}
