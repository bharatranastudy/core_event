import mongoose from 'mongoose'

const speakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Speaker name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Speaker designation is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Speaker company is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Short professional description is required'],
      trim: true,
    },
    fullBio: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Speaker portrait URL is required'],
    },
    track: {
      type: String,
      enum: ['AI & Systems', 'Design Craft', 'Growth & Brand', 'Engineering', 'Leadership'],
      default: 'Design Craft',
    },
    featured: {
      type: Boolean,
      default: true,
    },
    talkTitle: {
      type: String,
      trim: true,
      default: '',
    },
    socials: {
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  { timestamps: true }
)

const Speaker = mongoose.model('Speaker', speakerSchema)
export default Speaker
