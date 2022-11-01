import express from "express";
import bcryptjs from "bcryptjs";
import pool from "../db/db-connect";
import {
  checkIfUserExistsQuery,
  getUserByIdQuery,
} from "../db/queries/users/get-user";
import generateId from "../utils/generateId";
import { addUserQuery } from "../db/queries/users/add-user-query";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
  if (role.toLowerCase() !== "admin" && role.toLowerCase() !== "user") {
    return res.status(400).json({ message: "Invalid user role" });
  }

  try {
    // Check if user already exists
    const possibleUser = await pool.query(checkIfUserExistsQuery(username));
    if (possibleUser.rows[0]?.id) {
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
      addUserQuery(id, username, encryptedPassword, role.toLowerCase())
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

/**
 * @route   POST /api/user/auth
 * @access  Public
 * @desc    Authorize a user and send back a new, signed JWT
 *
 * @body    username - the user's username
 * @body    password - the user's password
 *
 * @status  400 - Invalid request body
 * @status  401 - Invalid credentials
 * @status  404 - User not found
 */
export const authorizeUser = async (
  req: express.Request,
  res: express.Response
) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password were sent
  if (!username || !password) {
    return res.status(400).json({
      message: "Please include all required fields in the request body",
    });
  }

  try {
    // Check if user exists
    const cQueryRes = await pool.query(checkIfUserExistsQuery(username));
    const userId = cQueryRes.rows[0]?.id;

    if (!userId) {
      return res
        .status(404)
        .json({ message: `User with username '${username}' not found` });
    }

    // Get user from database
    const uQueryRes = await pool.query(getUserByIdQuery(userId));
    const user = uQueryRes.rows[0];

    // Compare passwords
    const doPasswordsMatch = await bcrypt.compare(password, user.password);

    if (!doPasswordsMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If valid credentials, return the JWT
    const payload = {
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7 days",
    });

    // Return jsonwebtoken
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @route   GET /api/user
 * @access  Private - Authorization header
 * @desc    Check if authorization token is valid and user exists
 *
 * @status 200  Successfully authorized
 * @status 401  Unauthorized
 */
export const validateUser = async (
  req: express.Request,
  res: express.Response
) => {
  const username = req.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const uQueryRes = await pool.query(checkIfUserExistsQuery(username));
    const user = uQueryRes.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ message: "Authorization successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
