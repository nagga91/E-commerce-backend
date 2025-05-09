const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');
const router = express.Router();


router.post(
    '/register',
    [
      body('name').notEmpty().withMessage('Name required'),
      body('email').isEmail().withMessage('Invalid email'),
      body('password').isLength({ min: 6 }).withMessage('Min 6 characters')
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // continue to controller
      register(req, res);
    }
  );
router.post('/login', login);

// Protected route example
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
