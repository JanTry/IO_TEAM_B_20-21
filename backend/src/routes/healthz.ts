import express from "express";
import mongoose = require("mongoose");

export const healthzRoutes = express.Router();
healthzRoutes.get(
  "/",
  async (
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const statusCode = 200;
    const healthmessage = {
      message: "OK",
      uptime: process.uptime(),
      timestamp: Date.now(),
      dbConnection: mongoose.connection.readyState,
    };
    try {
      res.status(statusCode).send(healthmessage);
    } catch (e) {
      healthmessage.message = e;
      res.status(503).send();
    }
  }
);
