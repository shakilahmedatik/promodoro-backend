import express from 'express'
import { authenticateJWT } from '../middlewares/authentication.js'
import { rateLimit } from '../middlewares/rateLimit.js'
import {
  focusSessionLog,
  focusSessionMetrics,
  leaderboardOverall,
  leaderboardToday,
  saveFocusSession,
} from '../controllers/focusSessionController.js'

const router = express.Router()

router.post('/focus-session', authenticateJWT, rateLimit, saveFocusSession)
router.get('/focus-metrics', authenticateJWT, rateLimit, focusSessionMetrics)
router.get('/focus-logs', authenticateJWT, rateLimit, focusSessionLog)
router.get(
  '/leaderboard-overall',
  authenticateJWT,
  rateLimit,
  leaderboardOverall
)
router.get('/leaderboard-today', authenticateJWT, rateLimit, leaderboardToday)

export default router
