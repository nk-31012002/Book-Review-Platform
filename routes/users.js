const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');


router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
});


router.put(
  '/:id',
  verifyToken,
  [
    check('name', 'Name must be at least 3 characters').optional().isLength({ min: 3 }),
    check('email', 'Invalid email format').optional().isEmail(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (req.user.id !== req.params.id) {
        return res.status(403).json({ message: "Not authorized to update this profile" });
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
