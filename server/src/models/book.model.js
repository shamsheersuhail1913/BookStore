import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Book title is required"],
            trim: true,
        },

        author: {
            type: String,
            required: [true, "Author name is required"],
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },

        image: {
            type: String,
            default: "",
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        numReviews: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;