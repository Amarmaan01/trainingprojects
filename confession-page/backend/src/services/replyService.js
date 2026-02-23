import bcrypt from 'bcrypt';
import Reply from '../models/Reply.js';

const SALT_ROUNDS = 10;

/**
 * Create a reply for a confession
 */
export const createReply = async ({ confessionId, text, secretCode }) => {
  const hashedCode = await bcrypt.hash(secretCode, SALT_ROUNDS);

  const reply = await Reply.create({
    confessionId,
    text,
    secretCode: hashedCode,
  });

  const result = reply.toObject();
  delete result.secretCode;
  return result;
};

/**
 * Get replies for a confession
 */
export const getReplies = async (confessionId) => {
  const replies = await Reply.find({ confessionId })
    .select('-secretCode')
    .sort({ createdAt: -1 })
    .lean();

  return replies;
};

/**
 * Delete replies when a confession is deleted
 */
export const deleteRepliesByConfession = async (confessionId) => {
  await Reply.deleteMany({ confessionId });
};
