import mongoose from 'mongoose';

/**
 * @fileoverview
 * This module initializes and manages the MongoDB connection using Mongoose.
 * It connects to the database using the URI defined in the environment variable `MONGO_URI`.
 * The connection is established once during application startup.
 */

/**
 * @function DB
 * @async
 * @description Connects to MongoDB using Mongoose.
 * Logs a success message when the connection is established.
 * If the connection fails, logs the error and exits the process.
 *
 * @throws {Error} Throws an error if unable to connect to MongoDB.
 * @example
 * import DB from './config/db';
 * await DB(); // Initializes MongoDB connection
 */
const DB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit process with failure
  }
};

export default DB;