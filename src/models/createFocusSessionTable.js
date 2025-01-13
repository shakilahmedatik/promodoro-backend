import pool from '../config/db.js'

const createFocusSessionTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS focus_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    duration INT,
    timestamp TIMESTAMP WITH TIME ZONE
);
    `

  try {
    await pool.query(queryText)
    console.log('focus_session table created if not exists')
  } catch (error) {
    console.log('Error creating focus_session table : ', error)
  }
}

export default createFocusSessionTable
