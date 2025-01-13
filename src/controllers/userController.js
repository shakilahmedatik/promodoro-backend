import {
  registerUserService,
  loginUserService,
} from '../services/userService.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { handleResponse } from '../utils/utils.js'

export const registerUser = async (req, res, next) => {
  const { name, email, image, password } = req.body
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Name, email, and password are required' })
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await registerUserService(
      name,
      email,
      image,
      hashedPassword
    )
    handleResponse(res, 201, 'User created successfully', newUser)
  } catch (err) {
    next(err)
  }
}
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await loginUserService(email)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    // Remove the password field before returning
    if (user) {
      delete user.password
    }
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: '7d',
      }
    )
    res
      .cookie('token', token, {
        httpOnly: true, // Prevent client-side access
        secure: true, // Send only over HTTPS
        sameSite: 'None', // Allow cross-site requests with proper credentials
        domain: '.promodoro-backend.onrender.com', // Set the exact domain
      })
      .send({
        status: 200,
        message: 'Login Successful.',
        data: user,
      })
  } catch (err) {
    next(err)
  }
}
export const logoutUser = async (req, res, next) => {
  try {
    // Clear the authentication cookie
    res.clearCookie('token', {
      httpOnly: true, // Prevent client-side access
      secure: true, // Send only over HTTPS
      sameSite: 'None', // Allow cross-site requests with proper credentials
      domain: '.promodoro-backend.onrender.com', // Set the exact domain
    })
    handleResponse(res, 200, 'Logged out successfully')
  } catch (err) {
    next(err)
  }
}
