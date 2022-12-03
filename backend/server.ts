import express from "express";
import dotEnv from "dotenv";
import cors from "cors";
import photosRouter from "./routes/photos";
import photoRouter from "./routes/photo";
import userRouter from "./routes/user";
import app from "./setupServer";

app.listen(process.env.SERVER_PORT || 4000, () => {
  console.log("Server listening on port", process.env.SERVER_PORT || 4000);
});
