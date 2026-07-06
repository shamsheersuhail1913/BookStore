import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import Order from "../models/order.model.js";

export const getDashboardStats = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalBooks = await Book.countDocuments();

        const totalOrders = await Order.countDocuments();

        const revenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount",
                    },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalBooks,
                totalOrders,
                totalRevenue:
                    revenue.length > 0
                        ? revenue[0].totalRevenue
                        : 0,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};