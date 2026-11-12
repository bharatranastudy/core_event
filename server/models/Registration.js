import mongoose from 'mongoose'

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Selected event is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [7, 'Please provide a valid phone number'],
    },
    ticketType: {
      type: String,
      enum: ['General Pass', 'VIP All-Access', 'Virtual Stream'],
      default: 'General Pass',
    },
    ticketCode: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'checked-in', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
)

registrationSchema.index({ email: 1, event: 1 }, { unique: true })

registrationSchema.pre('save', function (next) {
  if (!this.ticketCode) {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase()
    this.ticketCode = `CS26-${random}`
  }
  next()
})

const Registration = mongoose.model('Registration', registrationSchema)
export default Registration
