import { Router } from "express";
import {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
} from "../controllers/auth.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/me", protect, getMe);

router.get(
    "/users",
    protect,
    authorize("admin"),
    getAllUsers
);

// Temporary Test Route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth Routes Working",
    });
});

export default router;