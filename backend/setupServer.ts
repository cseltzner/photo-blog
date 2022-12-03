import express from "express";
import cors from "cors";
import photosRouter from "./routes/photos";
import photoRouter from "./routes/photo";
import userRouter from "./routes/user";
import dotEnv from "dotenv";
dotEnv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/photos", photosRouter);
app.use("/api/photo", photoRouter);
app.use("/api/user", userRouter);

export default app;
