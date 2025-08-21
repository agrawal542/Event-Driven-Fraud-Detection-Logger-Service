import logger from "../config/logger_config.js";

// Custom AppError class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

// Standard error response structure
const ErrorResponse = {
  success: false,
  error: null,
};

// General error handler middleware
export const errorHandler = (err, req, res, next) => {
  // Ensure error is an instance of AppError
  if (!(err instanceof AppError)) {
    err = new AppError(err.message || "Internal Server Error", err.statusCode || 500);
  }

  // Log the error
  logger.error("Unhandled error", {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    body: req.body,
  });

  ErrorResponse.error = {
    message: err.message,
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  return res.status(err.statusCode).json(ErrorResponse);
};

// Handle 404 errors (Not Found)
export const notFound = (req, res, next) => {
  const err = new AppError("API Not Found", 404);

  // Log 404
  logger.info("404 Not Found", {
    path: req.originalUrl,
    method: req.method,
  });

  errorHandler(err, req, res, next);
};
