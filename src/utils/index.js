// Standardized response function
export const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  })
}

// calculate badge
export const assignBadge = streak => {
  if (streak >= 7) return 'Gold'
  if (streak >= 3) return 'Silver'
  return 'Bronze'
}
