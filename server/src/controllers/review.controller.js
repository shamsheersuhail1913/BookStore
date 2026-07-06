import Review from "../models/review.model.js";
import Book from "../models/book.model.js";

export const addReview = async (req, res) => {
    try {
        const { bookId, rating, comment } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        const review = await Review.create({
            user: req.user._id,
            book: bookId,
            rating,
            comment,
        });

        res.status(201).json({ success: true, message: "Review added successfully", data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBookReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId }).populate("user", "name");
        res.status(200).json({ success: true, totalReviews: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        await review.deleteOne();
        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
