import express from "express";
import {
  authorizeUser,
  registerUser,
  validateUser,
} from "../controllers/userController";
import auth from "../middleware/auth";
const router = express.Router();

/**
 * @route   POST /api/user/
 * @access  Private - Authorization header
 * @desc    Create a new user
 *
 * @body    username - unique username string
 * @body    password - password string
 * @body    role     - ("admin" | "user") - currently only "admin" has any use. "user" functionality may be added later
 */
router.post("/", auth, registerUser);

/**
 * @route   POST /api/user/auth
 * @access  Public
 * @desc    Authorize a user and send back a new, signed JWT
 *
 * @body    username - the user's username
 * @body    password - the user's password
 */
router.post("/auth", authorizeUser);

/**
 * @route   GET /api/user
 * @access  Private - Authorization header
 * @desc    Check if authorization token is valid and user exists
 */
router.get("/", auth, validateUser);

export default router;
