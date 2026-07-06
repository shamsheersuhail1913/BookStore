import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
    "/stats",
    protect,
    authorize("admin"),
    getDashboardStats
);

export default router;