import winston from 'winston';
import { config } from '../config/apiConfig';

// Import necessary Winston components
const { createLogger: winstonCreateLogger, format, transports } = winston;

/**
 * Creates and configures a Winston logger instance.
 * @returns {winston.Logger} A configured Winston logger instance.
 */
function createLogger(): winston.Logger {
  // Retrieve logging configuration from apiConfig
  const { logLevel, errorLogPath, combinedLogPath } = config.logging;

  // Create a new Winston logger instance
  const logger = winstonCreateLogger({
    level: logLevel,
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    transports: [
      // Configure console transport with appropriate log level and format
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple()
        )
      }),
      // Configure file transport for error logs
      new transports.File({
        filename: errorLogPath,
        level: 'error'
      }),
      // Configure file transport for combined logs
      new transports.File({
        filename: combinedLogPath
      })
    ]
  });

  // Return the configured logger instance
  return logger;
}

// The global logger instance for use throughout the application
export const logger = createLogger();

// Human tasks (commented):
// TODO: Review and adjust log levels in the configuration to balance between verbosity and performance
// TODO: Implement log rotation for file transports to manage log file sizes
// TODO: Consider adding additional transports for specific logging needs (e.g., error alerting)
// TODO: Develop a mechanism for dynamically changing log levels at runtime
// TODO: Implement a log sanitization mechanism to remove sensitive information before logging
// TODO: Create utility functions for common logging patterns specific to the Code Skeptic Scanner system