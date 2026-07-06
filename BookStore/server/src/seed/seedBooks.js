import mongoose from "mongoose";
import dotenv from "dotenv";

import Book from "../models/book.model.js";

dotenv.config();

const sellerId = new mongoose.Types.ObjectId(
    "6a41fe2599c4ff7c8cc4e87a"
);

await mongoose.connect(process.env.MONGODB_URI);

await Book.deleteMany();

await Book.insertMany([
    {
        title: "Atomic Habits",
        author: "James Clear",
        description: "A practical guide to building good habits.",
        price: 499,
        category: "Self Help",
        stock: 25,
        image: "",
        seller:sellerId,
    },
    {
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        description: "Personal finance classic.",
        price: 399,
        category: "Finance",
        stock: 20,
        image: "",
        seller:sellerId,
    },
    {
        title: "The Alchemist",
        author: "Paulo Coelho",
        description: "Inspirational novel.",
        price: 350,
        category: "Fiction",
        stock: 15,
        image: "",
        seller:sellerId,
    },
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        description: "Guide to writing maintainable code.",
        price: 699,
        category: "Programming",
        stock: 10,
        image: "",
        seller:sellerId,
    },
    {
        title: "Java: The Complete Reference",
        author: "Herbert Schildt",
        description: "Comprehensive Java guide.",
        price: 899,
        category: "Programming",
        stock: 18,
        image: "",
        seller:sellerId,
    },
    {
        title: "Think and Grow Rich",
        author: "Napoleon Hill",
        description: "Classic success book.",
        price: 450,
        category: "Self Help",
        stock: 30,
        image: "",
        seller:sellerId,
    },
    {
        title: "Ikigai",
        author: "Hector Garcia",
        description: "Japanese philosophy of life.",
        price: 420,
        category: "Self Help",
        stock: 16,
        image: "",
        seller:sellerId,
    },
    {
        title: "Deep Work",
        author: "Cal Newport",
        description: "Focus in a distracted world.",
        price: 550,
        category: "Productivity",
        stock: 22,
        image: "",
        seller:sellerId,
    },
    {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        description: "Programming best practices.",
        price: 799,
        category: "Programming",
        stock: 11,
        image: "",
        seller:sellerId,
    },
    {
        title: "Harry Potter",
        author: "J. K. Rowling",
        description: "Fantasy novel.",
        price: 650,
        category: "Fantasy",
        stock: 40,
        image: "",
        seller:sellerId,
    }
]);

console.log("✅ Books Seeded Successfully");

process.exit();