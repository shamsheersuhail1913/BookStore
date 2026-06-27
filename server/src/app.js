import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { logger } from "./middleware/logger.middleware.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { JSON_LIMIT } from "./constants/index.js";

const app = express();

/* ===========================
   GLOBAL MIDDLEWARE
=========================== */

// CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// Body Parser
app.use(
    express.json({
        limit: JSON_LIMIT,
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: JSON_LIMIT,
    })
);

// Static Files
app.use(express.static("public"));

// Cookies
app.use(cookieParser());

// Logger
app.use(logger);

/* ===========================
   ROUTES
=========================== */

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BookStore API is running successfully 🚀",
    });
});

/* ===========================
   ERROR HANDLERS
=========================== */

app.use(notFound);

app.use(errorHandler);

export { app };