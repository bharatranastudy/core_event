import Event from '../models/Event.js'

// @desc    Get all events with search, category, status, day filters
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { search, category, status, day, featured } = req.query
    const query = {}

    if (category && category !== 'All') query.category = category
    if (status && status !== 'All') query.status = status
    if (day && day !== 'All') query.day = day
    if (featured === 'true') query.featured = true

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i')
      query.$or = [
        { title: regex },
        { description: regex },
        { speakerName: regex },
        { location: regex },
        { category: regex },
      ]
    }

    const events = await Event.find(query)
      .populate('speaker', 'name role company image track socials')
      .sort({ featured: -1, createdAt: 1 })

    res.json({ events })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'speaker',
      'name role company bio image track socials'
    )

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' })
    }

    res.json({ event })
  } catch (error) {
    next(error)
  }
}

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      date,
      time,
      day,
      location,
      category,
      status,
      speaker,
      speakerName,
      speakerRole,
      image,
      capacity,
      featured,
      tags,
    } = req.body

    if (!title || !description || !date || !time || !location || !speakerName) {
      return res.status(400).json({
        message: 'Title, description, date, time, location, and speaker name are required.',
      })
    }

    const event = await Event.create({
      title,
      subtitle: subtitle || '',
      description,
      date,
      time,
      day: day || 'Day 01',
      location,
      category: category || 'Keynote',
      status: status || 'UPCOMING',
      speaker: speaker || undefined,
      speakerName,
      speakerRole: speakerRole || '',
      image: image || '/images/event-keynote.jpg',
      capacity: Number(capacity) || 250,
      featured: Boolean(featured),
      tags: Array.isArray(tags) ? tags : [],
    })

    res.status(201).json({ event })
  } catch (error) {
    next(error)
  }
}

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' })
    }

    Object.assign(event, req.body)
    const updated = await event.save()
    res.json({ event: updated })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' })
    }

    await event.deleteOne()
    res.json({ message: 'Event deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
