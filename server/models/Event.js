import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true,
    },
    day: {
      type: String,
      enum: ['Day 01', 'Day 02', 'Day 03'],
      default: 'Day 01',
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: ['Keynote', 'Workshop', 'Panel', 'Networking', 'Masterclass', 'Fireside'],
      default: 'Keynote',
    },
    status: {
      type: String,
      enum: ['LIVE', 'UPCOMING', 'REPLAY'],
      default: 'UPCOMING',
    },
    speaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Speaker',
    },
    speakerName: {
      type: String,
      required: [true, 'Speaker name is required'],
      trim: true,
    },
    speakerRole: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Event image URL is required'],
    },
    capacity: {
      type: Number,
      default: 250,
      min: 1,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

const Event = mongoose.model('Event', eventSchema)
export default Event
