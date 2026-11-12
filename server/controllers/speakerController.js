import Speaker from '../models/Speaker.js'

// @desc    Get all speakers
// @route   GET /api/speakers
// @access  Public
export const getSpeakers = async (req, res, next) => {
  try {
    const { search, track } = req.query
    const query = {}

    if (track && track !== 'All') query.track = track
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i')
      query.$or = [{ name: regex }, { role: regex }, { company: regex }, { bio: regex }]
    }

    const speakers = await Speaker.find(query).sort({ featured: -1, createdAt: 1 })
    res.json({ speakers })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single speaker
// @route   GET /api/speakers/:id
// @access  Public
export const getSpeakerById = async (req, res, next) => {
  try {
    const speaker = await Speaker.findById(req.params.id)
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found.' })
    }
    res.json({ speaker })
  } catch (error) {
    next(error)
  }
}

// @desc    Create speaker
// @route   POST /api/speakers
// @access  Private/Admin
export const createSpeaker = async (req, res, next) => {
  try {
    const { name, role, company, bio, fullBio, image, track, featured, talkTitle, socials } =
      req.body

    if (!name || !role || !company || !bio) {
      return res.status(400).json({
        message: 'Name, role, company, and short bio are required.',
      })
    }

    const speaker = await Speaker.create({
      name,
      role,
      company,
      bio,
      fullBio: fullBio || bio,
      image: image || '/images/speaker-aria.jpg',
      track: track || 'Design Craft',
      featured: featured !== undefined ? Boolean(featured) : true,
      talkTitle: talkTitle || '',
      socials: socials || {},
    })

    res.status(201).json({ speaker })
  } catch (error) {
    next(error)
  }
}

// @desc    Update speaker
// @route   PUT /api/speakers/:id
// @access  Private/Admin
export const updateSpeaker = async (req, res, next) => {
  try {
    const speaker = await Speaker.findById(req.params.id)
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found.' })
    }

    Object.assign(speaker, req.body)
    const updated = await speaker.save()
    res.json({ speaker: updated })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete speaker
// @route   DELETE /api/speakers/:id
// @access  Private/Admin
export const deleteSpeaker = async (req, res, next) => {
  try {
    const speaker = await Speaker.findById(req.params.id)
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found.' })
    }

    await speaker.deleteOne()
    res.json({ message: 'Speaker deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
