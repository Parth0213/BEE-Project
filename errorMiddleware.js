class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Set default values for error message and status code
  const defaultMessage = "Internal Server Error";
  const defaultStatusCode = 500;

  // Handle specific error types
  if (err.code === 11000) {
    err = new ErrorHandler(`Duplicate ${Object.keys(err.keyValue)} Entered`, 400);
  } else if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Json Web Token is invalid, Try again!", 400);
  } else if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Json Web Token is expired, Try again!", 400);
  } else if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid ${err.path}`, 400);
  }

  // Extract error message from validation errors if present
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message || defaultMessage;

  // Return the response with a valid status code
  res.status(err.statusCode || defaultStatusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
