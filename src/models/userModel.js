import pool from '../config/db.js'

export const registerUserService = async (
  name,
  email,
  image,
  hashedPassword
) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, image, password) VALUES ($1, $2, $3, $4)',
    [name, email, image, hashedPassword]
  )
  return result.rows[0]
}
export const loginUserService = async email => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ])
  return result.rows[0]
}
