import Book from "../models/book.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// Create a Book
export const createBook = async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            const uploadedImage = await uploadToCloudinary(req.file.buffer);
            imageUrl = uploadedImage.secure_url;
        }

        console.log("Body:", req.body);
        console.log("File:", req.file);


        const book = await Book.create({
            ...req.body,
            image: imageUrl,
            seller: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get All Books with Search, Filter, Pagination & Sorting
export const getAllBooks = async (req, res) => {
    try {
        const {
            search,
            category,
            page = 1,
            limit = 10,
            sort = "createdAt",
        } = req.query;

        const query = {};

        // Search by title or author
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        const books = await Book.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalBooks = await Book.countDocuments(query);

        res.status(200).json({
            success: true,
            totalBooks,
            currentPage: Number(page),
            totalPages: Math.ceil(totalBooks / limit),
            data: books,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Single Book by ID
export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        res.status(200).json({
            success: true,
            data: book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Book
export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        // Seller can update only their own books
        if (
            req.user.role !== "admin" &&
            book.seller.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this book",
            });
        }

        Object.assign(book, req.body);

        await book.save();

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Book
export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        // Seller can delete only their own books
        if (
            req.user.role !== "admin" &&
            book.seller.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this book",
            });
        }

        await book.deleteOne();

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const getSellerBooks = async (req, res) => {

    try {

        const books = await Book.find({
            seller: req.user._id,
        });

        res.status(200).json({
            success: true,
            totalBooks: books.length,
            data: books,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};