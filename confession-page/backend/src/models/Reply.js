import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    confessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Confession',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Reply text is required'],
      trim: true,
      maxlength: [500, 'Reply cannot exceed 500 characters'],
    },
    secretCode: {
      type: String,
      required: [true, 'Secret code is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookup by confession
replySchema.index({ confessionId: 1, createdAt: -1 });

const Reply = mongoose.model('Reply', replySchema);

export default Reply;
