import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import routes
import authRouter from "./auth/auth.router";
import usersRouter from "./users/users.router";
import postsRouter from "./posts/posts.router";
import commentsRouter from "./comments/comments.router";
import followersRouter from "./followers/followers.router";
import likesRouter from "./likes/likes.router";
import uploadRouter from "./upload/upload.router"; // NEW

const initializeApp = () => {
  const app = express();

  app.use(express.json());
  app.use(helmet());

  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://social-media-app.vercel.app",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  });
  app.use("/api", limiter);

  app.get("/", (_req, res) => {
    res.json({
      status: "ok",
      message: "Social Media API Server",
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/posts", postsRouter);
  app.use("/api/comments", commentsRouter);
  app.use("/api/followers", followersRouter);
  app.use("/api/likes", likesRouter);
  app.use("/api/upload", uploadRouter); // NEW

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  });

  return app;
};

const app = initializeApp();
export default app;