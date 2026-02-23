import mongoose from 'mongoose';

const confessionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Confession text is required'],
      trim: true,
      maxlength: [2000, 'Confession cannot exceed 2000 characters'],
    },
    secretCode: {
      type: String,
      required: [true, 'Secret code is required'],
    },
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
    },
    reactedBy: {
      like: [{ type: String }],
      love: [{ type: String }],
      laugh: [{ type: String }],
    },
    userId: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    sentiment: {
      type: String,
      enum: ['Sad', 'Regret', 'Neutral', 'Romantic', 'Funny', 'Angry'],
      default: 'Neutral',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
confessionSchema.index({ createdAt: -1 });
confessionSchema.index({ expiryDate: 1 });
confessionSchema.index({ 'reactions.love': -1 });

const Confession = mongoose.model('Confession', confessionSchema);

export default Confession;
