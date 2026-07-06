import { Router } from "express";
import { addToCart, getMyCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, addToCart);
router.get("/", protect, getMyCart);
router.put("/:bookId", protect, updateCartItem);
router.delete("/:bookId", protect, removeCartItem);
router.delete("/", protect, clearCart);

export default router;