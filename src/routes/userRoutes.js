import express from 'express'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/userController.js'
import validateUser from '../middlewares/inputValidator.js'
import { rateLimit } from '../middlewares/rateLimit.js'

const router = express.Router()

router.post('/user', validateUser, createUser)
router.get('/user', rateLimit, getAllUsers)
router.get('/user/:id', getUserById)
router.put('/user/:id', validateUser, updateUser)
router.delete('/user/:id', deleteUser)

export default router
