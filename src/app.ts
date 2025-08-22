import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import healthRouter from "./routes/health";
import apisRouter from "./routes/apis";
import { connectRedis } from "./db/redis";
connectRedis();
const app = express();
const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || "0.0.0.0";
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", healthRouter);
app.use("/api", apisRouter);

// Start server
app.listen(parseInt(PORT), HOST, () => {
  console.log(`Jsapithrottler server running on http://${HOST}:${PORT}`);
});

export default app;
