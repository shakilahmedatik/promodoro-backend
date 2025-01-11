import redisClient from '../config/redisClient.js'

export const rateLimit = async (req, res, next) => {
  const user_id = req.user.id // JWT middleware populates req.user
  const path = req?.route?.path.split('/')[1] || ''
  const cacheKey = `rate-limit-${path}:${user_id}`
  console.log(cacheKey)
  try {
    const current = await redisClient.incr(cacheKey)
    console.log(current)
    if (current === 1) {
      // Set expiry to 1 minute for the key
      await redisClient.expire(cacheKey, 60)
    }

    if (current > 10) {
      // Limit: 10 requests per minute
      return res.status(429).send('Too many requests. Please try again later.')
    }

    next()
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
}
