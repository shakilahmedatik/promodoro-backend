import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './config/db.js'
import redisClient from './config/redisClient.js'
import userRoutes from './routes/userRoutes.js'
import focusSessionRoutes from './routes/focusSessionRoutes.js'
import createUserTable from './models/createUserTable.js'
import createFocusSessionsTable from './models/createFocusSessionTable.js'
import cookieParser from 'cookie-parser'
import { logger } from './middlewares/winstonLogger.js'
import { httpRequestDuration } from './middlewares/prometheusLogger.js'
import { register } from 'prom-client'
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
// Define Metrics

// Middlewares
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://promodoro-beta.vercel.app',
    'https://promodoro-app-theta.vercel.app',
  ],
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
// Middleware to log requests
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url })
  next()
})

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error({ message: err.message, stack: err.stack })
  res.status(500).send('Internal Server Error')
})
// Middleware to track request duration
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer() // Start the timer
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    })
  })
  next()
})
// Your API routes
app.get('/api', (req, res) => {
  res.send('Hello, Prometheus!')
})

// Endpoint to expose metrics to Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

// Routes
app.use('/api', userRoutes)
app.use('/api', focusSessionRoutes)

//Create table before starting server
createUserTable()
createFocusSessionsTable()

// Testing POSTGRES Connection
app.get('/', async (req, res) => {
  console.log('Start')
  const result = await pool.query('SELECT current_database()')
  console.log('result', result.rows)
  res.send(`The database name is : ${result.rows[0].current_database}`)
})

// Server running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
