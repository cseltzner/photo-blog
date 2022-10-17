import express from "express";
import bcryptjs from "bcryptjs";
import pool from "../db/db-connect";
import { checkIfUserExists } from "../db/queries/users/get-user";
import generateId from "../utils/generateId";
import { addUser } from "../db/queries/users/add-user";
import jwt from "jsonwebtoken";

/**
 * @route   POST /api/user/
 * @access  Private - Authorization header
 * @desc    Create a new user, most likely an administrator
 *
 * @body    username - unique username string
 * @body    password - password string
 * @body    role     - ("admin" | "user") - currently only "admin" has any use. "user" functionality may be added later
 *
 * @status  200 - User successfully created. Returns { token: token }
 * @status  400 - Invalid request body
 * @status  409 - User already exists
 */
export const registerUser = async (
  req: express.Request,
  res: express.Response
) => {
  const username: string | undefined = req.body.username;
  const password: string | undefined = req.body.password;
  const role = req.body.role;

  // Check if all required fields are included in request body
  if (!username || !password || !role) {
    return res.status(400).json({
      message: "Please include all requested fields (username, password, role)",
    });
  }

  // Check if role is "admin" or "user"
  if (role.toLowerCase() !== "admin" || role.toLowerCase() !== "user") {
    return res.status(400).json({ message: "Invalid user role" });
  }

  try {
    // Check if user already exists
    const possibleUser = await pool.query(checkIfUserExists(username));
    if (possibleUser.rows) {
      return res.status(409).json({ message: "User already exists" });
    }

    // If user can be created //

    // Create new ID
    const id = generateId();

    // Encrypt password
    const salt = await bcryptjs.genSalt(10);
    const encryptedPassword = await bcryptjs.hash(password, salt);

    // Save user to database
    await pool.query(
      addUser(id, username, encryptedPassword, role.toLowerCase())
    );

    // Create jsonwebtoken
    const payload = {
      username: username,
      role: role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "4 hours",
    });

    // Return jsonwebtoken
    res.json({ token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server Error" });
  }
};
