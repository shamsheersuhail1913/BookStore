import { ApiError } from "../utils/ApiError.js";

/**
 * Global Error Handling Middleware
 * Catches all errors and returns a standardized response.
 */

const errorHandler = (err, req, res, next) => {
    let error = err;

    // Convert unknown errors into ApiError
    if (!(error instanceof ApiError)) {
        error = new ApiError(
            error.statusCode || 500,
            error.message || "Internal Server Error",
            error.errors || [],
            error.stack
        );
    }

    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
    };

    if (process.env.NODE_ENV === "development") {
        response.stack = error.stack;
    }

    return res.status(error.statusCode).json(response);
};

export { errorHandler };