import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './config/db.js'
import redisClient from './config/redisClient.js'
import userRoutes from './routes/userRoutes.js'
import errorHandling from './middlewares/errorHandler.js'
import createUserTable from './data/createUserTable.js'
import cookieParser from 'cookie-parser'
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(cookieParser())
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
}
app.use(cors(corsOptions))

// Routes
app.use('/api/user', userRoutes)

// Error handling middleware
app.use(errorHandling)

//Create table before starting server
createUserTable()

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
