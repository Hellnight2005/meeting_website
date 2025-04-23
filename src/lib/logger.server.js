const winston = require("winston");

// Define log levels
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "grey",
  },
};

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const logger = winston.createLogger({
  levels: logLevels.levels,
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "warn" : "debug", // Set appropriate log level
      format: logFormat,
    }),
    new winston.transports.File({
      filename: "logs/combined.log", // Log all levels in this file
      level: "info", // Only log info and above for production
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error", // Only log errors in this file
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

winston.addColors(logLevels.colors);

module.exports = logger;
