import { Router } from "express";
import { createBook, getAllBooks, getBookById, updateBook, deleteBook, getSellerBooks } from "../controllers/book.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

// Static routes before dynamic /:id
router.get("/", getAllBooks);
router.get("/seller/my-books", protect, authorize("seller"), getSellerBooks);
router.get("/:id", getBookById);

router.post("/", protect, authorize("seller", "admin"), upload.single("image"), createBook);
router.put("/:id", protect, authorize("seller", "admin"), updateBook);
router.delete("/:id", protect, authorize("seller", "admin"), deleteBook);

export default router;
