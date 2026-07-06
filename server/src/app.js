import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { logger } from "./middleware/logger.middleware.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { JSON_LIMIT } from "./constants/index.js";

import bookRoutes from "./routes/book.routes.js";

import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ===========================
   GLOBAL MIDDLEWARE
=========================== */

// CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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
// Book Routes
app.use("/api/books", bookRoutes);

app.use("/api/cart", cartRoutes);

// Auth Routes
app.use("/api/auth", authRoutes);

// Order Routes
app.use("/api/orders", orderRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/dashboard", dashboardRoutes);

if (process.env.NODE_ENV === "production") {
    const clientBuildPath = path.resolve(__dirname, "../../client/dist");
    app.use(express.static(clientBuildPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(clientBuildPath, "index.html"));
    });
}

/* ===========================
   ERROR HANDLERS
=========================== */

app.use(notFound);

app.use(errorHandler);

export { app };