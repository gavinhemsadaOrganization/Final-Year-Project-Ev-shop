import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import DB from "./config/DBConnection";
import logger from "./utils/logger";
import { connectRedis } from "./config/redis";

const PORT = process.env.PORT;
const start = async () => {
  try {
    // Connect to MongoDB
    await DB();
    logger.info('MongoDB connected successfully');
    // Connect to Redis
    await connectRedis();
    logger.info('Redis connected successfully');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on ${process.env.CLIENT_URL}:${PORT}`);
      logger.info(`Server running on ${process.env.CLIENT_URL}:${PORT}`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err}`);
  }
};

start();
