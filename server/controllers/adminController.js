import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import Speaker from '../models/Speaker.js'
import User from '../models/User.js'

// @desc    Get admin analytics & dashboard overview
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalEvents,
      upcomingEvents,
      liveEvents,
      replayEvents,
      totalUsers,
      totalSpeakers,
      totalRegistrations,
      recentRegistrations,
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ status: 'UPCOMING' }),
      Event.countDocuments({ status: 'LIVE' }),
      Event.countDocuments({ status: 'REPLAY' }),
      User.countDocuments(),
      Speaker.countDocuments(),
      Registration.countDocuments({ status: { $ne: 'cancelled' } }),
      Registration.find()
        .populate('event', 'title date status category')
        .sort({ createdAt: -1 })
        .limit(8),
    ])

    const users = await User.find().select('-password').sort({ createdAt: -1 }).limit(20)

    res.json({
      stats: {
        totalEvents,
        upcomingEvents,
        liveEvents,
        replayEvents,
        totalUsers,
        totalSpeakers,
        totalRegistrations,
      },
      recentRegistrations,
      users,
    })
  } catch (error) {
    next(error)
  }
}
