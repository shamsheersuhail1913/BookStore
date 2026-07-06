/**
 * Application Constants
 */

// Database Name
export const DB_NAME = "bookstore";

// Cookie Configuration
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

// Maximum JSON request size
export const JSON_LIMIT = "10mb";