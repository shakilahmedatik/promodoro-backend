import {
  calculateCurrentStreakService,
  calculateLongestStreakService,
  getDailyMetricsService,
  getFocusSessionLogService,
  getLeaderboardService,
  getWeeklyMetricsService,
  saveFocusSessionService,
} from '../models/focusSessionModel.js'
import { assignBadge, handleResponse } from '../utils/index.js'
import redisClient from '../config/redisClient.js'

// set focus session data
export const saveFocusSession = async (req, res, next) => {
  const { id } = req.user
  const { user_id, duration, timestamp } = req.body
  try {
    const response = await saveFocusSessionService(user_id, duration, timestamp)
    // Invalidate cached data
    const focusCacheKey = `focus-metrics:${id}`
    const leaderboardCacheKey = `leaderboard:${id}`
    const focusLogCacheKey = `focus-log:${id}`
    await redisClient.del(focusCacheKey) // Delete cached focus metrics for this user
    await redisClient.del(leaderboardCacheKey) // Delete cached leaderboardCacheKey for this user
    await redisClient.del(focusLogCacheKey) // Delete cached focusLogCacheKey for this user
    handleResponse(res, 201, 'Focus session logged', response)
  } catch (err) {
    next(err)
  }
}

// get focus session log for chart
export const focusSessionLog = async (req, res, next) => {
  const { id, timezone } = req.user

  try {
    const cacheKey = `focus-log:${id}`
    const cachedMetrics = await redisClient.get(cacheKey)

    if (cachedMetrics) {
      return handleResponse(
        res,
        200,
        'Focus Session Log Fetched Successfully. (Cached)',
        JSON.parse(cachedMetrics)
      )
    }

    const focusSessionLog = await getFocusSessionLogService(id, timezone)

    // Cache the result for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(focusSessionLog))
    handleResponse(
      res,
      200,
      'Focus Session Log Fetched Successfully.',
      focusSessionLog
    )
  } catch (err) {
    next(err)
  }
}
// get focus metrics
export const focusSessionMetrics = async (req, res, next) => {
  const { id, timezone } = req.user

  try {
    const cacheKey = `focus-metrics:${id}`
    const cachedMetrics = await redisClient.get(cacheKey)

    if (cachedMetrics) {
      return handleResponse(
        res,
        200,
        'Focus Session Metrics Fetched Successfully. (Cached)',
        JSON.parse(cachedMetrics)
      )
    }

    const dailyMetrics = await getDailyMetricsService(id, timezone)
    const weeklyMetrics = await getWeeklyMetricsService(id, timezone)
    const currentStreak = await calculateCurrentStreakService(id, timezone)
    const longestStreak = await calculateLongestStreakService(id)
    const currentBadge = assignBadge(currentStreak)
    const highestBadge = assignBadge(longestStreak)
    const metrics = {
      dailyMetrics,
      weeklyMetrics,
      currentStreak,
      longestStreak,
      currentBadge,
      highestBadge,
    }
    // Cache the result for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(metrics))
    handleResponse(
      res,
      200,
      'Focus Session Metrics Fetched Successfully.',
      metrics
    )
  } catch (err) {
    next(err)
  }
}

//get leaderboard data
export const leaderBoard = async (req, res, next) => {
  const id = req.user.id

  try {
    const cacheKey = `leaderboard:${id}`
    const cachedMetrics = await redisClient.get(cacheKey)

    if (cachedMetrics) {
      return handleResponse(
        res,
        200,
        'LeaderBoard Data Fetched Successfully. (Cached)',
        JSON.parse(cachedMetrics)
      )
    }
    const leaderBoardData = await getLeaderboardService()
    // Cache the result for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(leaderBoardData))
    handleResponse(
      res,
      200,
      'LeaderBoard Data Fetched Successfully.',
      leaderBoardData
    )
  } catch (err) {
    next(err)
  }
}
