import winston from "winston";
import fs from "fs";
import path from "path";

const logDir = "logs";

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

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

winston.addColors(colors);

const devFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const transports = [
  // In development, log to the console with a simple, colorized format
  process.env.NODE_ENV !== "production"
    ? new winston.transports.Console({ format: devFormat })
    : // In production, log to files in JSON format
      new winston.transports.Console({ format: prodFormat }),

  new winston.transports.File({
    filename: path.join(logDir, "error.log"),
    level: "error",
    format: prodFormat,
  }),
  new winston.transports.File({
    filename: path.join(logDir, "combined.log"),
    format: prodFormat,
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

export default logger;
