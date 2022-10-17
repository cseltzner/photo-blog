import express from "express";
import { registerUser } from "../controllers/userController";
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

export default router;
