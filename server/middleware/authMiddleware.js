import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not configured.')
  }
  return secret
}

export const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized — authentication token missing.' })
    }

    const decoded = jwt.verify(token, getJwtSecret())
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Not authorized — user account no longer exists.' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized — invalid or expired token.' })
  }
}

export const optionalProtect = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, getJwtSecret())
      const user = await User.findById(decoded.id).select('-password')
      if (user) {
        req.user = user
      }
    }
  } catch {
    // Ignore optional auth failure for public endpoints
  }
  next()
}

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  return res.status(403).json({ message: 'Access denied — administrator privileges required.' })
}
