// index.js — Express server entry point
import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./auth.js";
import dotenv from "dotenv";
import cors from "cors";

import { userRouter } from "./routes/api/users.js";
import { bugRouter } from "./routes/api/bugs.js";
import { commentRouter } from "./routes/api/comments.js";
import { testRouter } from "./routes/api/tests.js";
import { ping } from "./database.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// --- Middleware ---
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- API Routes ---
app.use("/api/users", userRouter);
app.use("/api/bugs", bugRouter);
app.use("/api/comments", commentRouter);
app.use("/api/tests", testRouter);
app.all("/api/auth/*splat", toNodeHandler(auth));

// --- Database ping ---
ping()
  .then(() => console.log("Database ping successful"))
  .catch((err) => console.error("Database ping failed:", err));

// --- Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// --- Start Server ---
app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
