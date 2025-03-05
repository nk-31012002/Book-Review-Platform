const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Book = require('../models/Book');
const { verifyToken } = require('../middleware/auth');

router.post(
  '/',
  verifyToken, 
  [
    check('book', 'Book ID is required').not().isEmpty(),
    check('reviewText', 'Review must be at least 5 characters').isLength({ min: 5 }),
    check('rating', 'Rating must be a number between 1 and 5').isFloat({ min: 1, max: 5 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { book, reviewText, rating } = req.body;
      const review = new Review({
        user: req.user.id, 
        book,
        reviewText,
        rating
      });

      const savedReview = await review.save();

      await Book.findByIdAndUpdate(book, { $push: { reviews: savedReview._id } });

      res.status(201).json(savedReview);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
