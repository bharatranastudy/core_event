import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['attendee', 'speaker', 'admin'],
      default: 'attendee',
    },
    title: {
      type: String,
      trim: true,
      default: 'Product Innovator',
    },
    company: {
      type: String,
      trim: true,
      default: 'Independent',
    },
    audienceTrack: {
      type: String,
      enum: ['Founders', 'Design Leads', 'Marketers', 'Engineers'],
      default: 'Design Leads',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: 'Exploring next-gen digital products, AI interfaces, and scalable systems at ConnectSphere 2026.',
    },
    interests: {
      type: [String],
      default: ['Product Strategy', 'Design Systems', 'AI'],
    },
    avatar: {
      type: String,
      default: '',
    },
    isPublicNetworking: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
