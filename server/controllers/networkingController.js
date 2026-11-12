import Connection from '../models/Connection.js'
import Speaker from '../models/Speaker.js'
import User from '../models/User.js'

// @desc    Get networking directory (attendees + speakers)
// @route   GET /api/networking/attendees
// @access  Public
export const getNetworkingProfiles = async (req, res, next) => {
  try {
    const { search, track } = req.query

    const userQuery = { isPublicNetworking: true }
    if (track && track !== 'All') {
      userQuery.audienceTrack = track
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i')
      userQuery.$or = [{ name: regex }, { title: regex }, { company: regex }, { bio: regex }]
    }

    const [users, speakers] = await Promise.all([
      User.find(userQuery).select('name title company audienceTrack bio interests avatar role').limit(30),
      Speaker.find().select('name role company bio image track talkTitle socials').limit(20),
    ])

    res.json({ attendees: users, speakers })
  } catch (error) {
    next(error)
  }
}

// @desc    Create a networking connection request
// @route   POST /api/networking/connect
// @access  Private
export const createConnection = async (req, res, next) => {
  try {
    const { targetId, targetName, targetRole, note } = req.body
    if (!targetId || !targetName) {
      return res.status(400).json({ message: 'Target profile is required.' })
    }

    const existing = await Connection.findOne({
      requester: req.user._id,
      targetId,
    })

    if (existing) {
      return res.status(200).json({ message: 'Already connected.', connection: existing })
    }

    const connection = await Connection.create({
      requester: req.user._id,
      targetId,
      targetName,
      targetRole: targetRole || '',
      note: note || 'Looking forward to connecting at ConnectSphere 2026!',
      status: 'connected',
    })

    res.status(201).json({ message: 'Connected successfully!', connection })
  } catch (error) {
    next(error)
  }
}

// @desc    Get my networking connections
// @route   GET /api/networking/connections
// @access  Private
export const getMyConnections = async (req, res, next) => {
  try {
    const connections = await Connection.find({ requester: req.user._id }).sort({ createdAt: -1 })
    res.json({ connections })
  } catch (error) {
    next(error)
  }
}
