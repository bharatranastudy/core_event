import Event from '../models/Event.js'
import Registration from '../models/Registration.js'

// @desc    Create a new event registration (public or authenticated)
// @route   POST /api/registrations
// @access  Public (optional auth attaches user)
export const createRegistration = async (req, res, next) => {
  try {
    const { eventId, fullName, email, phone, ticketType } = req.body

    if (!eventId || !fullName || !email || !phone) {
      return res.status(400).json({
        message: 'Full name, email, phone number, and selected event are required.',
      })
    }

    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Selected event does not exist.' })
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ message: 'This event has reached full capacity.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existing = await Registration.findOne({
      event: eventId,
      email: normalizedEmail,
      status: { $ne: 'cancelled' },
    })

    if (existing) {
      return res.status(409).json({
        message: 'You are already registered for this event with this email address.',
        registration: existing,
      })
    }

    const registration = await Registration.create({
      user: req.user ? req.user._id : null,
      event: event._id,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      ticketType: ticketType || 'General Pass',
    })

    event.registeredCount = (event.registeredCount || 0) + 1
    await event.save()

    const populated = await Registration.findById(registration._id).populate(
      'event',
      'title date time location category status image speakerName'
    )

    res.status(201).json({
      message: 'Registration confirmed! Your ConnectSphere pass is ready.',
      registration: populated,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get registrations for current logged-in user
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      $or: [{ user: req.user._id }, { email: req.user.email }],
    })
      .populate('event', 'title date time day location category status image speakerName speakerRole')
      .sort({ createdAt: -1 })

    res.json({ registrations })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all registrations (Admin)
// @route   GET /api/registrations
// @access  Private/Admin
export const getAllRegistrations = async (req, res, next) => {
  try {
    const { eventId, status } = req.query
    const query = {}
    if (eventId && eventId !== 'All') query.event = eventId
    if (status && status !== 'All') query.status = status

    const registrations = await Registration.find(query)
      .populate('event', 'title date time location category status')
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })

    res.json({ registrations })
  } catch (error) {
    next(error)
  }
}

// @desc    Update registration status (Admin)
// @route   PATCH /api/registrations/:id
// @access  Private/Admin
export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id)
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' })
    }

    const { status } = req.body
    if (!['confirmed', 'checked-in', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid registration status.' })
    }

    const wasCancelled = registration.status === 'cancelled'
    registration.status = status
    await registration.save()

    if (!wasCancelled && status === 'cancelled') {
      await Event.findByIdAndUpdate(registration.event, { $inc: { registeredCount: -1 } })
    } else if (wasCancelled && status !== 'cancelled') {
      await Event.findByIdAndUpdate(registration.event, { $inc: { registeredCount: 1 } })
    }

    const populated = await Registration.findById(registration._id).populate(
      'event',
      'title date time location category status'
    )

    res.json({ registration: populated })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel/Delete registration
// @route   DELETE /api/registrations/:id
// @access  Private
export const deleteRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id)
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' })
    }

    const isOwner =
      (registration.user && registration.user.toString() === req.user._id.toString()) ||
      registration.email === req.user.email

    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this registration.' })
    }

    if (registration.status !== 'cancelled') {
      await Event.findByIdAndUpdate(registration.event, { $inc: { registeredCount: -1 } })
    }

    await registration.deleteOne()
    res.json({ message: 'Registration removed successfully.' })
  } catch (error) {
    next(error)
  }
}
