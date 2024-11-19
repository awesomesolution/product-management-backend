import winston from 'winston';
import path from 'path';

// Define the log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a logger with file and console transports
const logger = winston.createLogger({
  level: 'info', // Log level (info, warn, error)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    logFormat
  ),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, 'api.log') }),
    new winston.transports.Console() // To also log in the console
  ],
});

export default logger;