export const notFound = (req, res, next) => {
  const error = new Error(`Route not found — ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export const errorHandler = (err, req, res, _next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message || 'Internal Server Error'

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Requested resource was not found.'
  }

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ')
  }

  if (err.code === 11000) {
    statusCode = 409
    const duplicateField = Object.keys(err.keyPattern || {})[0] || 'field'
    message = `Duplicate value detected for ${duplicateField}.`
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
