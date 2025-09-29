import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import DB from "./config/DBConnection";
import logger from "./utils/logger";

const PORT = process.env.PORT;
const start = async () => {
  try {
    await DB();
    app.listen(PORT, () => {
      logger.info(`Server running on ${process.env.CLIENT_URL}:${PORT}`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err}`);
  }
};

start();
