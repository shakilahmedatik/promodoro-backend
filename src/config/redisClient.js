import { createClient } from 'redis'
const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: retries => Math.min(retries * 50, 2000), // Reconnect strategy
  },
})
// Handle connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis')
})

redisClient.on('error', err => {
  console.error('Redis Client Error', err)
})

// Connect to Redis
redisClient.connect()

export default redisClient
