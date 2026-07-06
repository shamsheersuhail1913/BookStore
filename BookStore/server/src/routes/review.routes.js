import { Router } from "express";
import {
    addReview,
    getBookReviews,
    deleteReview,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, addReview);

router.get("/:bookId", getBookReviews);

router.delete("/:id", protect, deleteReview);

export default router;