import express from "express";
import mongoose from "mongoose";

const healthRouter = express.Router();

healthRouter.get("/health", (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    db: dbConnected ? "connected" : "disconnected",
  });
});

export default healthRouter;
