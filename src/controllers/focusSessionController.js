import {
  calculateCurrentStreakService,
  calculateLongestStreakService,
  getDailyMetricsService,
  getFocusSessionLogService,
  getLeaderboardOverallService,
  getWeeklyMetricsService,
  saveFocusSessionService,
  getLeaderboardTodayService,
} from '../services/focusSessionModel.js'
import {
  assignBadge,
  handleResponse,
  invalidateRedisCache,
} from '../utils/utils.js'
import redisClient from '../config/redisClient.js'

// set focus session data
export const saveFocusSession = async (req, res, next) => {
  const { id } = req.user
  const { user_id, duration, timestamp } = req.body
  try {
    const response = await saveFocusSessionService(user_id, duration, timestamp)
    // Invalidate cached data
    invalidateRedisCache(id).map(async cacheKey => {
      console.log(cacheKey)
      return await redisClient.del(cacheKey)
    })

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

// get daily & weekly focus metrics
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

//get leaderboard data for today
export const leaderboardToday = async (req, res, next) => {
  const { id, timezone } = req.user

  try {
    const cacheKey = `leaderboard-today:${id}`
    const cachedMetrics = await redisClient.get(cacheKey)

    if (cachedMetrics) {
      return handleResponse(
        res,
        200,
        'LeaderBoard Today Data Fetched Successfully. (Cached)',
        JSON.parse(cachedMetrics)
      )
    }
    const leaderBoardData = await getLeaderboardTodayService(timezone)
    // Cache the result for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(leaderBoardData))
    handleResponse(
      res,
      200,
      'LeaderBoard Today Data Fetched Successfully.',
      leaderBoardData
    )
  } catch (err) {
    next(err)
  }
}
//get leaderboard data for all time
export const leaderboardOverall = async (req, res, next) => {
  const id = req.user.id

  try {
    const cacheKey = `leaderboard-overall:${id}`
    const cachedMetrics = await redisClient.get(cacheKey)

    if (cachedMetrics) {
      return handleResponse(
        res,
        200,
        'LeaderBoard Overall Data Fetched Successfully. (Cached)',
        JSON.parse(cachedMetrics)
      )
    }
    const leaderBoardData = await getLeaderboardOverallService()
    // Cache the result for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(leaderBoardData))
    handleResponse(
      res,
      200,
      'LeaderBoard Overall Data Fetched Successfully.',
      leaderBoardData
    )
  } catch (err) {
    next(err)
  }
}
