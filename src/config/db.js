import pkg from 'pg'
import dotenv from 'dotenv'
const { Pool } = pkg
dotenv.config()

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }, // Required for Render
})

pool.on('connect', () => {
  console.log('Connection pool established with Database')
})

export default pool
