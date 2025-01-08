import {
  registerUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  loginUserService,
  updateUserService,
} from '../models/userModel.js'

// Standardized response function
const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  })
}

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
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h',
    })
    res.cookie('token', token, { httpOnly: true })
    handleResponse(res, 201, 'Login Successful.', user)
  } catch (err) {
    next(err)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService()
    handleResponse(res, 200, 'Users fetched successfully', users)
  } catch (err) {
    next(err)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id)
    if (!user) return handleResponse(res, 404, 'User not found')
    handleResponse(res, 200, 'User fetched successfully', user)
  } catch (err) {
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  const { name, email } = req.body
  try {
    const updatedUser = await updateUserService(req.params.id, name, email)
    if (!updatedUser) return handleResponse(res, 404, 'User not found')
    handleResponse(res, 200, 'User updated successfully', updatedUser)
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id)
    if (!deletedUser) return handleResponse(res, 404, 'User not found')
    handleResponse(res, 200, 'User deleted successfully', deleteUser)
  } catch (err) {
    next(err)
  }
}
