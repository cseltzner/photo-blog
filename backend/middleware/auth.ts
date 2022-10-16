import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token must be sent in the Authorization header" });
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    // Set username and role from JWT token to req.user
    req.username = decodedToken.username;
    req.role = decodedToken.role;

    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
