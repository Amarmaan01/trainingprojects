import { body, param, query } from 'express-validator';
import { validationResult } from 'express-validator';

// Validation result handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};

// Confession validators
export const confessionValidators = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Confession text is required')
    .isLength({ max: 2000 })
    .withMessage('Confession cannot exceed 2000 characters')
    .escape(),
  body('secretCode')
    .trim()
    .notEmpty()
    .withMessage('Secret code is required')
    .isLength({ min: 4 })
    .withMessage('Secret code must be at least 4 characters'),
  body('expiry')
    .optional()
    .isIn(['permanent', '24h', '7d'])
    .withMessage('Invalid expiry option'),
];

// Reply validators
export const replyValidators = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Reply text is required')
    .isLength({ max: 500 })
    .withMessage('Reply cannot exceed 500 characters')
    .escape(),
  body('secretCode')
    .trim()
    .notEmpty()
    .withMessage('Secret code is required')
    .isLength({ min: 4 })
    .withMessage('Secret code must be at least 4 characters'),
];

// Secret code validator for edit/delete
export const secretCodeValidator = [
  body('secretCode')
    .trim()
    .notEmpty()
    .withMessage('Secret code is required'),
];

// Reaction validator
export const reactionValidator = [
  body('type')
    .isIn(['like', 'love', 'laugh'])
    .withMessage('Invalid reaction type. Must be like, love, or laugh'),
];

// Sort query validator
export const sortValidator = [
  query('sort')
    .optional()
    .isIn(['latest', 'mostLoved', 'trending'])
    .withMessage('Invalid sort option'),
];

// Param ID validator
export const idValidator = [
  param('id').isMongoId().withMessage('Invalid confession ID'),
];
