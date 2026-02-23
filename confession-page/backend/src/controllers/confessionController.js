import * as confessionService from '../services/confessionService.js';
import * as replyService from '../services/replyService.js';

/**
 * POST /api/confessions - Create a confession
 */
export const createConfession = async (req, res, next) => {
  try {
    const { text, secretCode, expiry } = req.body;
    const userId = req.user.googleId;

    const confession = await confessionService.createConfession({
      text,
      secretCode,
      expiry: expiry || 'permanent',
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Confession posted successfully',
      data: confession,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/confessions - Get all confessions
 */
export const getConfessions = async (req, res, next) => {
  try {
    const sort = req.query.sort || 'latest';
    const userId = req.user?.googleId || null;
    const confessions = await confessionService.getConfessions(sort, userId);
    const count = await confessionService.getConfessionCount();

    res.status(200).json({
      success: true,
      message: 'Confessions fetched successfully',
      count,
      data: confessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/confessions/:id - Update confession (requires secret code)
 */
export const updateConfession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { secretCode, text } = req.body;

    const { valid, error } = await confessionService.verifySecretCode(id, secretCode);
    if (!valid) {
      return res.status(error === 'Confession not found' ? 404 : 403).json({
        success: false,
        message: error,
      });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updated text is required',
      });
    }

    const updated = await confessionService.updateConfession(id, text.trim());

    res.status(200).json({
      success: true,
      message: 'Confession updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/confessions/:id - Delete confession (requires secret code)
 */
export const deleteConfession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { secretCode } = req.body;

    const { valid, error } = await confessionService.verifySecretCode(id, secretCode);
    if (!valid) {
      return res.status(error === 'Confession not found' ? 404 : 403).json({
        success: false,
        message: error,
      });
    }

    // Delete associated replies
    await replyService.deleteRepliesByConfession(id);
    await confessionService.deleteConfession(id);

    res.status(200).json({
      success: true,
      message: 'Confession deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/confessions/:id/react - Add reaction
 */
export const addReaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user.googleId;

    const updated = await confessionService.addReaction(id, type, userId);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Confession not found',
      });
    }

    if (updated.alreadyReacted) {
      return res.status(400).json({
        success: false,
        message: `You have already reacted with ${type}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reaction added',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/confessions/:id/reply - Add reply
 */
export const addReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, secretCode } = req.body;

    // Verify confession exists
    const confession = await confessionService.getConfessionById(id);
    if (!confession) {
      return res.status(404).json({
        success: false,
        message: 'Confession not found',
      });
    }

    const reply = await replyService.createReply({
      confessionId: id,
      text,
      secretCode,
    });

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/confessions/:id/replies - Get replies for a confession
 */
export const getReplies = async (req, res, next) => {
  try {
    const { id } = req.params;
    const replies = await replyService.getReplies(id);

    res.status(200).json({
      success: true,
      message: 'Replies fetched successfully',
      data: replies,
    });
  } catch (error) {
    next(error);
  }
};
