import { Router } from 'express';
import {
  createConfession,
  getConfessions,
  updateConfession,
  deleteConfession,
  addReaction,
  addReply,
  getReplies,
} from '../controllers/confessionController.js';
import {
  validate,
  confessionValidators,
  replyValidators,
  secretCodeValidator,
  reactionValidator,
  sortValidator,
  idValidator,
} from '../middlewares/validators.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = Router();

// GET /api/confessions - Get all confessions (public)
router.get('/', sortValidator, validate, getConfessions);

// POST /api/confessions - Create a new confession (auth required)
router.post('/', isAuthenticated, confessionValidators, validate, createConfession);

// PUT /api/confessions/:id - Update confession (auth required + secret code)
router.put('/:id', isAuthenticated, idValidator, secretCodeValidator, validate, updateConfession);

// DELETE /api/confessions/:id - Delete confession (auth required + secret code)
router.delete('/:id', isAuthenticated, idValidator, secretCodeValidator, validate, deleteConfession);

// POST /api/confessions/:id/react - Add a reaction (auth required, 1 per user)
router.post('/:id/react', isAuthenticated, idValidator, reactionValidator, validate, addReaction);

// POST /api/confessions/:id/reply - Add a reply (auth required)
router.post('/:id/reply', isAuthenticated, idValidator, replyValidators, validate, addReply);

// GET /api/confessions/:id/replies - Get replies (public)
router.get('/:id/replies', idValidator, validate, getReplies);

export default router;
