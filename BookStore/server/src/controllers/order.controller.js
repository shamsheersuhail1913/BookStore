import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

export const placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        let totalAmount = 0;
        const items = cart.items.map((item) => {
            totalAmount += item.book.price * item.quantity;
            return { book: item.book._id, quantity: item.quantity, price: item.book.price };
        });

        const order = await Order.create({ user: req.user._id, items, totalAmount });

        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, message: "Order placed successfully", data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.book");
        res.status(200).json({ success: true, totalOrders: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.book");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: req.body.orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order status updated", data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.book");

        res.status(200).json({
            success: true,
            totalOrders: orders.length,
            data: orders,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};
