import { ApiError } from "../utils/ApiError.js";

/**
 * Handles requests to routes that do not exist.
 */

const notFound = (req, res, next) => {
    next(
        new ApiError(
            404,
            `Route not found: ${req.originalUrl}`
        )
    );
};

export { notFound };