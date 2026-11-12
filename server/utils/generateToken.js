import jwt from 'jsonwebtoken'

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not configured.')
  }

  return jwt.sign({ id, role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export default generateToken
