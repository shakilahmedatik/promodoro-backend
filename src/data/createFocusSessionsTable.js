import pool from '../config/db.js'

const createFocusSessionsTable = async () => {
  const queryText = `
    CREATE TABLE focus_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    duration INT,
    timestamp TIMESTAMP DEFAULT NOW()
);
    `

  try {
    await pool.query(queryText)
    console.log('User table created if not exists')
  } catch (error) {
    console.log('Error creating users table : ', error)
  }
}

export default createFocusSessionsTable
