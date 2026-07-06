import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaBoxOpen } from "react-icons/fa";
import api from "../services/api";

const PLACEHOLDER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=260&fit=crop&auto=format";

function StatusBadge({ status }) {
    const map = {
        Pending:    "status-pending",
        Processing: "status-processing",
        Delivered:  "status-delivered",
        Cancelled:  "status-cancelled",
    };
    return (
        <span className={`badge ${map[status] || "status-pending"}`} style={{ fontSize: 12 }}>
            {status}
        </span>
    );
}

function Orders() {
    const [orders, setOrders]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/orders")
            .then(res => setOrders(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="container">
                    {[1,2].map(i => (
                        <div key={i} className="skeleton mb-4" style={{ height: 160, borderRadius: 12 }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="container">
                <h2 className="section-title mb-4">
                    <FaClipboardList style={{ color: "var(--primary)" }} /> My Orders
                </h2>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><FaBoxOpen /></div>
                        <h4>No orders yet</h4>
                        <p>You haven't placed any orders. Start shopping!</p>
                        <Link to="/" className="btn btn-primary mt-4">Browse Books</Link>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {orders.map((order, idx) => (
                            <div className="order-card fade-in" key={order._id}
                                style={{ animationDelay: `${idx * 0.05}s` }}>
                                <div className="order-header">
                                    <div>
                                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Order ID</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>
                                            #{order._id?.slice(-10).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Total</div>
                                            <div style={{ fontWeight: 800, color: "var(--primary)" }}>₹{order.totalAmount}</div>
                                        </div>
                                        <StatusBadge status={order.orderStatus} />
                                    </div>
                                </div>

                                <div className="order-body">
                                    <div className="d-flex flex-wrap gap-3">
                                        {order.items?.map(item => (
                                            <div key={item._id} className="d-flex gap-3 align-items-center"
                                                style={{ background: "var(--bg)", borderRadius: 10, padding: "10px 14px", minWidth: 200 }}>
                                                <img
                                                    src={item.book?.image?.trim() || PLACEHOLDER}
                                                    alt={item.book?.title}
                                                    style={{ width: 48, height: 60, objectFit: "cover", borderRadius: 6 }}
                                                />
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.book?.title}</div>
                                                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Qty: {item.quantity}</div>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>₹{item.price}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;
