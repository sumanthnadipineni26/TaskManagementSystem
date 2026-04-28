/**
 * Global Error Handler
 * - Catches all errors and returns a consistent JSON response
 * - In development, includes the error stack trace
 */
const errorHandler = (err, req, res, _next) => {
  console.error("❌ Error:", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
