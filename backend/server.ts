import express from "express";
import dotEnv from "dotenv";
import cors from "cors";
import photosRouter from "./routes/photos";

dotEnv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/photos", photosRouter);

app.listen(process.env.SERVER_PORT || 4000, () => {
  console.log("Server listening on port", process.env.SERVER_PORT || 4000);
});
