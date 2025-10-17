import winston from "winston";
import fs from "fs";
import path from "path";

// Define the directory where log files will be stored.
const logDir = "logs";

// Create the log directory synchronously if it does not already exist.
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

/**
 * Defines the custom logging levels for the application.
 * This allows for a prioritized and organized logging strategy.
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

/**
 * Determines the logging level based on the current environment.
 * In development, it logs everything up to 'debug'.
 * In production, it logs only 'info' and higher to reduce noise.
 *
 * @returns The logging level string ('debug' or 'info').
 */
const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "info";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Apply the custom color scheme to Winston.
winston.addColors(colors);

/**
 * Defines the log format for the development environment.
 * It includes a timestamp, colorization for readability, and a simple printf-style output.
 */
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

/**
 * Defines the log format for the production environment.
 * It includes a standard timestamp and outputs logs in a structured JSON format,
 * which is ideal for log aggregation and analysis tools.
 */
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// An array of Winston transport configurations.
// Transports are the destinations for log messages (e.g., console, files).
const transports = [
  // In development, log to the console with a simple, colorized format
  process.env.NODE_ENV !== "production"
    ? new winston.transports.Console({ format: devFormat })
    : // In production, log to files in JSON format
      new winston.transports.Console({ format: prodFormat }),

  // A transport to log only 'error' level messages to a dedicated 'error.log' file.
  new winston.transports.File({
    filename: path.join(logDir, "error.log"),
    level: "error",
    format: prodFormat,
  }),
  // A transport to log all messages (up to the configured level) to a 'combined.log' file.
  new winston.transports.File({
    filename: path.join(logDir, "combined.log"),
    format: prodFormat,
  }),
];

/**
 * The main logger instance created with the defined levels, level function, and transports.
 * This logger should be imported and used throughout the application for all logging purposes.
 *
 * @example logger.info('User logged in');
 */
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

export default logger;
