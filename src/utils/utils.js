// Standardized response function
export const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  })
}

// calculate badge
export const assignBadge = streak => {
  if (streak >= 7) return 'Gold'
  if (streak >= 3) return 'Silver'
  return 'Bronze'
}

export const invalidateRedisCache = id => {
  const focusCacheKey = `focus-metrics:${id}`
  const overallLeaderboardCacheKey = `leaderboard-overall:${id}`
  const todayLeaderboardCacheKey = `leaderboard-today:${id}`
  const focusLogCacheKey = `focus-log:${id}`
  return [
    focusCacheKey,
    overallLeaderboardCacheKey,
    todayLeaderboardCacheKey,
    focusLogCacheKey,
  ]
}
