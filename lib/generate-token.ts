import jwt from 'jsonwebtoken'

export const generateToken = async (userId?: string) => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')
  if (!userId) throw new Error('User ID is required')
  
  return jwt.sign({ userId }, secret, { expiresIn: '10m' })
}
