import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { placeOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders } from "../controllers/order.controller.js";

const router = Router();

router.get("/all", protect, authorize("admin"), getAllOrders);

router.post("/", protect, placeOrder);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

export default router;
