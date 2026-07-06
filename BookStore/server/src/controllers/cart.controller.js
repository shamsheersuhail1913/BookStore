import Cart from "../models/cart.model.js";
import Book from "../models/book.model.js";

export const addToCart = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ book: bookId, quantity: quantity || 1 }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.book.toString() === bookId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity || 1;
            } else {
                cart.items.push({ book: bookId, quantity: quantity || 1 });
            }

            await cart.save();
        }

        res.status(200).json({ success: true, message: "Book added to cart", data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");

        if (!cart) {
            return res.status(200).json({ success: true, data: { items: [], totalPrice: 0 } });
        }

        let totalPrice = 0;
        cart.items.forEach((item) => {
            totalPrice += item.book.price * item.quantity;
        });

        res.status(200).json({ success: true, totalItems: cart.items.length, totalPrice, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const item = cart.items.find((item) => item.book.toString() === bookId);

        if (!item) {
            return res.status(404).json({ success: false, message: "Book not found in cart" });
        }

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({ success: true, message: "Quantity updated", data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { bookId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
        await cart.save();

        res.status(200).json({ success: true, message: "Book removed from cart", data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
