import pool from '../config/db.js'

export const getAllUsersService = async () => {
  const result = await pool.query('SELECT * FROM users')
  return result.rows
}
export const getUserByIdService = async id => {
  const result = await pool.query('SELECT * FROM users where id = $1', [id])
  return result.rows[0]
}
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
export const updateUserService = async (id, name, email, image) => {
  const result = await pool.query(
    'UPDATE users SET name=$1, email=$2, image=$3 WHERE id=$3 RETURNING *',
    [name, email, image, id]
  )
  return result.rows[0]
}

export const deleteUserService = async id => {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [id]
  )
  return result.rows[0]
}
