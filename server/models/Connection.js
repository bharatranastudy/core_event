import mongoose from 'mongoose'

const connectionSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    targetName: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      trim: true,
      maxlength: 280,
      default: 'Would love to connect during ConnectSphere 2026.',
    },
    status: {
      type: String,
      enum: ['pending', 'connected'],
      default: 'connected',
    },
  },
  { timestamps: true }
)

connectionSchema.index({ requester: 1, targetId: 1 }, { unique: true })

const Connection = mongoose.model('Connection', connectionSchema)
export default Connection
