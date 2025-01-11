import jwt from 'jsonwebtoken'
// Middleware to authenticate JWT
export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token
  const timezone = req.headers['x-user-timezone']

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err)
      return res.status(403).json({ message: 'Forbidden' })
    }
    req.user = { ...user, timezone }
    next()
  })
}
