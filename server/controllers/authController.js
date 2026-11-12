import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  title: user.title,
  company: user.company,
  audienceTrack: user.audienceTrack,
  bio: user.bio,
  interests: user.interests,
  avatar: user.avatar,
})

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, title, company, audienceTrack } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim() || '',
      title: title?.trim() || 'Product Builder',
      company: company?.trim() || 'Independent',
      audienceTrack: audienceTrack || 'Design Leads',
      role: 'attendee',
    })

    const token = generateToken(user._id, user.role)
    res.status(201).json({
      user: formatUser(user),
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Authenticate user & get JWT
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = generateToken(user._id, user.role)
    res.json({
      user: formatUser(user),
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  res.json({ user: formatUser(req.user) })
}

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const allowed = ['name', 'phone', 'title', 'company', 'audienceTrack', 'bio', 'interests', 'isPublicNetworking']
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field]
      }
    })

    const updated = await user.save()
    res.json({ user: formatUser(updated) })
  } catch (error) {
    next(error)
  }
}
