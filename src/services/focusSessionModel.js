import pool from '../config/db.js'

export const saveFocusSessionService = async (user_id, duration, timestamp) => {
  const result = await pool.query(
    `INSERT INTO focus_sessions (user_id, duration, timestamp)
         VALUES ($1, $2, to_timestamp($3, 'YYYY-MM-DD'))`,
    [user_id, duration, timestamp]
  )
  return result.rowCount // Number of rows inserted
}
// Get all focus sessions for a user
export const getFocusSessionLogService = async (
  user_id,
  timezone = 'Asia/Dhaka'
) => {
  const result = await pool.query(
    `
    SELECT 
      TO_CHAR(date_series.generated_date, 'YYYY-MM-DD') AS date, 
      COALESCE(focus_data.totalSessions, 0) AS "totalSessions",
      COALESCE(focus_data.totalDuration, 0) AS "totalDuration"
    FROM (
      SELECT 
        GENERATE_SERIES(
          DATE(CURRENT_TIMESTAMP AT TIME ZONE $2) - INTERVAL '9 days',
          DATE(CURRENT_TIMESTAMP AT TIME ZONE $2),
          INTERVAL '1 day'
        ) AS generated_date
    ) date_series
    LEFT JOIN (
      SELECT 
        timestamp::date AS log_date, 
        COUNT(*) AS totalSessions, 
        SUM(duration) AS totalDuration
      FROM focus_sessions
      WHERE user_id = $1
        AND timestamp::date >= (DATE(CURRENT_TIMESTAMP AT TIME ZONE $2) - INTERVAL '10 days')
      GROUP BY log_date
    ) focus_data
    ON date_series.generated_date = focus_data.log_date
    ORDER BY date_series.generated_date DESC
    `,
    [user_id, timezone]
  )
  return result.rows
}

export const getTodaysFocusCountService = async (
  user_id,
  timezone = 'Asia/Dhaka'
) => {
  const result = await pool.query(
    `
        SELECT COUNT(*) AS today_focus_count
        FROM focus_sessions
        WHERE user_id = $1 AND timestamp::date = DATE(CURRENT_TIMESTAMP AT TIME ZONE $2);
    `,
    [user_id, timezone]
  )
  return result.rows[0].today_focus_count || 0 // Default to 0 if no sessions exist
}

// Daily metrics
export const getDailyMetricsService = async (
  user_id,
  timezone = 'Asia/Dhaka'
) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS sessions, SUM(duration) AS total_time
         FROM focus_sessions
         WHERE user_id = $1 
         AND timestamp::date = DATE(CURRENT_TIMESTAMP AT TIME ZONE $2)`,
    [user_id, timezone]
  )
  return result.rows[0]
}

// Weekly metrics
export const getWeeklyMetricsService = async (
  user_id,
  timezone = 'Asia/Dhaka'
) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS sessions, SUM(duration) AS total_time
         FROM focus_sessions
         WHERE user_id = $1 
         AND timestamp::date >= (DATE(CURRENT_TIMESTAMP AT TIME ZONE $2) - INTERVAL '7 days')`,
    [user_id, timezone]
  )
  return result.rows[0]
}
// Get current streak
export const calculateCurrentStreakService = async (
  user_id,
  timezone = 'Asia/Dhaka'
) => {
  const result = await pool.query(
    `
        WITH consecutive_days AS (
            SELECT 
                timestamp::date AS session_date,
                ROW_NUMBER() OVER (ORDER BY timestamp::date) AS row_num
            FROM focus_sessions
            WHERE user_id = $1
            GROUP BY timestamp::date
        ),
        streak_groups AS (
            SELECT 
                session_date,
                row_num,
                session_date - (row_num || ' days')::INTERVAL AS streak_group
            FROM consecutive_days
        )
        SELECT COUNT(*) AS current_streak
        FROM streak_groups
        WHERE streak_group = (
            SELECT session_date - (row_num || ' days')::INTERVAL
            FROM streak_groups
            ORDER BY session_date DESC
            LIMIT 1
        )
        AND session_date <= DATE(CURRENT_TIMESTAMP AT TIME ZONE $2);
    `,
    [user_id, timezone]
  )
  return result.rows[0].current_streak
}

// get longest streak
export const calculateLongestStreakService = async user_id => {
  const result = await pool.query(
    `
        WITH consecutive_days AS (
            SELECT 
                timestamp::date AS session_date,
                ROW_NUMBER() OVER (ORDER BY timestamp::date) AS row_num
            FROM focus_sessions
            WHERE user_id = $1
            GROUP BY timestamp::date
        ),
        streak_groups AS (
            SELECT 
                session_date,
                row_num,
                session_date - (row_num || ' days')::INTERVAL AS streak_group
            FROM consecutive_days
        )
        SELECT MAX(streak_length) AS longest_streak
        FROM (
            SELECT 
                streak_group,
                COUNT(*) AS streak_length
            FROM streak_groups
            GROUP BY streak_group
        ) AS grouped_streaks;
      `,
    [user_id]
  )
  return result.rows[0].longest_streak || 0
}

// get todays Leaderboard by total_focus_time
export const getLeaderboardTodayService = async (timezone = 'Asia/Dhaka') => {
  const result = await pool.query(
    `
         SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.image AS user_image, 
        SUM(fs.duration) AS total_focus_time,
        RANK() OVER (ORDER BY SUM(fs.duration) DESC) AS rank
    FROM focus_sessions fs
    JOIN users u ON fs.user_id = u.id
    WHERE timestamp::date = DATE(CURRENT_TIMESTAMP AT TIME ZONE $1)
    GROUP BY u.id, u.name, u.image
    ORDER BY rank`,
    [timezone]
  )
  return result.rows
}
// get overall Leaderboard by total_focus_time
export const getLeaderboardOverallService = async () => {
  const result = await pool.query(
    `
    SELECT 
            u.id AS user_id,
            u.name AS user_name,
            u.image AS user_image, 
            SUM(fs.duration) AS total_focus_time,
            RANK() OVER (ORDER BY SUM(fs.duration) DESC) AS rank
         FROM focus_sessions fs
         JOIN users u ON fs.user_id = u.id
         GROUP BY u.id, u.name, u.image
         ORDER BY rank
    `
  )
  return result.rows
}
