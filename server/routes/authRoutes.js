const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

/**
 * Helper — generate a JWT for a given user id
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

/**
 * POST /api/auth/register
 * Create a new user account
 */
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res, next) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create user (password is hashed via pre-save hook)
      const user = await User.create({ name, email, password });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/login
 * Authenticate a user and return a JWT
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user and include password field
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare passwords
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/auth/me
 * Return currently authenticated user's profile
 */
const { protect } = require("../middleware/auth");

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

/**
 * GET /api/auth/users
 * Return all users (for task assignment dropdown)
 */
router.get("/users", protect, async (_req, res, next) => {
  try {
    const users = await User.find().select("name email");
    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
