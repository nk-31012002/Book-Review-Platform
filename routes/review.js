const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const { verifyToken } = require('../middleware/auth');


router.get('/:bookId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});


router.post('/', verifyToken, async (req, res, next) => {
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
});

module.exports = router;
