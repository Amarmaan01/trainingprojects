import bcrypt from 'bcrypt';
import Confession from '../models/Confession.js';
import { analyzeSentiment } from './sentimentService.js';

const SALT_ROUNDS = 10;

/**
 * Create a new confession
 */
export const createConfession = async ({ text, secretCode, expiry, userId }) => {
  const hashedCode = await bcrypt.hash(secretCode, SALT_ROUNDS);
  const sentiment = analyzeSentiment(text);

  let expiryDate = null;
  if (expiry === '24h') {
    expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  } else if (expiry === '7d') {
    expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const confession = await Confession.create({
    text,
    secretCode: hashedCode,
    userId,
    expiryDate,
    sentiment,
  });

  // Return without secretCode
  const result = confession.toObject();
  delete result.secretCode;
  delete result.userId;
  return result;
};

/**
 * Get all confessions with sorting
 */
export const getConfessions = async (sort = 'latest', userId = null) => {
  // Exclude expired confessions
  const filter = {
    $or: [
      { expiryDate: null },
      { expiryDate: { $gt: new Date() } },
    ],
  };

  let confessions;

  if (sort === 'mostLoved') {
    confessions = await Confession.find(filter)
      .select('-secretCode -userId')
      .sort({ 'reactions.love': -1 })
      .lean();
  } else if (sort === 'trending') {
    // Fetch all then compute trending score dynamically
    confessions = await Confession.find(filter)
      .select('-secretCode -userId')
      .lean();

    const now = Date.now();
    confessions = confessions.map((c) => {
      const hoursSincePosted = (now - new Date(c.createdAt).getTime()) / (1000 * 60 * 60);
      const trendingScore =
        (c.reactions.like * 1 + c.reactions.love * 2 + c.reactions.laugh * 1.5) /
        (hoursSincePosted + 1);
      return { ...c, trendingScore };
    });

    confessions.sort((a, b) => b.trendingScore - a.trendingScore);
  } else {
    // Default: latest
    confessions = await Confession.find(filter)
      .select('-secretCode -userId')
      .sort({ createdAt: -1 })
      .lean();
  }

  // Add userReactions and strip reactedBy
  confessions = confessions.map((c) => {
    const userReactions = userId
      ? {
          like: c.reactedBy?.like?.includes(userId) || false,
          love: c.reactedBy?.love?.includes(userId) || false,
          laugh: c.reactedBy?.laugh?.includes(userId) || false,
        }
      : { like: false, love: false, laugh: false };
    const { reactedBy, ...rest } = c;
    return { ...rest, userReactions };
  });

  return confessions;
};

/**
 * Get a single confession by ID
 */
export const getConfessionById = async (id) => {
  const confession = await Confession.findById(id).lean();
  return confession;
};

/**
 * Verify secret code for a confession
 */
export const verifySecretCode = async (confessionId, secretCode) => {
  const confession = await Confession.findById(confessionId);
  if (!confession) return { valid: false, confession: null, error: 'Confession not found' };

  const isMatch = await bcrypt.compare(secretCode, confession.secretCode);
  if (!isMatch) return { valid: false, confession, error: 'Invalid secret code' };

  return { valid: true, confession, error: null };
};

/**
 * Update confession text
 */
export const updateConfession = async (id, text) => {
  const sentiment = analyzeSentiment(text);
  const updated = await Confession.findByIdAndUpdate(
    id,
    { text, sentiment },
    { new: true, runValidators: true }
  )
    .select('-secretCode -userId')
    .lean();

  return updated;
};

/**
 * Delete a confession
 */
export const deleteConfession = async (id) => {
  await Confession.findByIdAndDelete(id);
};

/**
 * Add a reaction to a confession
 */
export const addReaction = async (id, type, userId) => {
  // Check if user already reacted with this type
  const confession = await Confession.findById(id);
  if (!confession) return null;

  if (confession.reactedBy?.[type]?.includes(userId)) {
    return { alreadyReacted: true };
  }

  const updated = await Confession.findByIdAndUpdate(
    id,
    {
      $inc: { [`reactions.${type}`]: 1 },
      $addToSet: { [`reactedBy.${type}`]: userId },
    },
    { new: true }
  )
    .select('-secretCode -userId')
    .lean();

  // Add userReactions to response
  if (updated) {
    updated.userReactions = {
      like: updated.reactedBy?.like?.includes(userId) || false,
      love: updated.reactedBy?.love?.includes(userId) || false,
      laugh: updated.reactedBy?.laugh?.includes(userId) || false,
    };
    delete updated.reactedBy;
  }

  return updated;
};

/**
 * Delete expired confessions
 */
export const deleteExpiredConfessions = async () => {
  const result = await Confession.deleteMany({
    expiryDate: { $ne: null, $lte: new Date() },
  });
  return result.deletedCount;
};

/**
 * Get total count of confessions
 */
export const getConfessionCount = async () => {
  return await Confession.countDocuments({
    $or: [
      { expiryDate: null },
      { expiryDate: { $gt: new Date() } },
    ],
  });
};
