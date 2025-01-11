import express from 'express'
import { authenticateJWT } from '../middlewares/authentication.js'
import { rateLimit } from '../middlewares/rateLimit.js'
import {
  focusSessionLog,
  focusSessionMetrics,
  leaderBoard,
  saveFocusSession,
} from '../controllers/focusSessionController.js'

const router = express.Router()

router.post('/focus-session', authenticateJWT, rateLimit, saveFocusSession)
router.get('/focus-metrics', authenticateJWT, rateLimit, focusSessionMetrics)
router.get('/focus-logs', authenticateJWT, rateLimit, focusSessionLog)
router.get('/leaderboard', authenticateJWT, rateLimit, leaderBoard)

export default router
