import express from 'express'
import {
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/userController.js'
import validateUser from '../middlewares/inputValidator.js'

const router = express.Router()

router.post('/user/register', validateUser, registerUser)
router.post('/user/login', loginUser)
router.post('/user/logout', logoutUser)

export default router
