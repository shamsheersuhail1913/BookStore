import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import api from "../services/api";

const PLACEHOLDER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=260&fit=crop&auto=format";

function Cart() {
    const [cart, setCart]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { getCart(); }, []);

    async function getCart() {
        try {
            const res = await api.get("/cart");
            setCart(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function placeOrder() {
        setPlacing(true);
        try {
            await api.post("/orders", {});
            alert("🎉 Order placed successfully!");
            navigate("/orders");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to place order");
        } finally {
            setPlacing(false);
        }
    }

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="container">
                    {[1,2,3].map(i => (
                        <div key={i} className="skeleton mb-3" style={{ height: 120, borderRadius: 12 }} />
                    ))}
                </div>
            </div>
        );
    }

    const items      = cart?.data?.items || [];
    const totalPrice = cart?.data?.totalPrice ?? items.reduce((s, i) => s + i.book.price * i.quantity, 0);

    if (items.length === 0) {
        return (
            <div className="page-wrapper">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon"><FaShoppingCart /></div>
                        <h4>Your cart is empty</h4>
                        <p>Looks like you haven't added any books yet.</p>
                        <Link to="/" className="btn btn-primary mt-4">Browse Books</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="container">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>
                    <h2 style={{ margin: 0 }}>
                        <FaShoppingCart style={{ color: "var(--primary)", marginRight: 8 }} />
                        My Cart
                        <span className="badge ms-2" style={{ background: "var(--primary)", color: "#fff", fontSize: 14 }}>
                            {items.length}
                        </span>
                    </h2>
                </div>

                <div className="row g-4">
                    {/* Items */}
                    <div className="col-lg-8">
                        <div className="d-flex flex-column gap-3">
                            {items.map(item => (
                                <div className="cart-item-card fade-in" key={item._id}>
                                    <img
                                        src={item.book?.image?.trim() || PLACEHOLDER}
                                        alt={item.book?.title}
                                    />
                                    <div className="flex-fill">
                                        <h6 style={{ fontWeight: 700, marginBottom: 4 }}>{item.book?.title}</h6>
                                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
                                            by {item.book?.author}
                                        </p>
                                        <div className="d-flex align-items-center gap-3 flex-wrap">
                                            <span style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)" }}>
                                                ₹{item.book?.price}
                                            </span>
                                            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                                Qty: <strong>{item.quantity}</strong>
                                            </span>
                                            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                                Subtotal: <strong>₹{item.book?.price * item.quantity}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="col-lg-4">
                        <div className="cart-summary-card">
                            <h5 style={{ fontWeight: 700, marginBottom: 20 }}>Order Summary</h5>

                            <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                                <span style={{ color: "var(--text-muted)" }}>Subtotal ({items.length} items)</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2" style={{ fontSize: 14 }}>
                                <span style={{ color: "var(--text-muted)" }}>Delivery</span>
                                <span style={{ color: "var(--success)", fontWeight: 600 }}>FREE</span>
                            </div>

                            <hr style={{ borderColor: "var(--border)" }} />

                            <div className="d-flex justify-content-between mb-4">
                                <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                                <span style={{ fontWeight: 800, fontSize: 22, color: "var(--primary)" }}>₹{totalPrice}</span>
                            </div>

                            <button
                                className="btn btn-success w-100 py-2"
                                onClick={placeOrder}
                                disabled={placing}
                            >
                                {placing
                                    ? <><span className="spinner-border spinner-border-sm me-2" />Placing Order...</>
                                    : <><FaCheckCircle /> Place Order</>
                                }
                            </button>

                            <Link to="/" className="btn btn-outline-secondary w-100 mt-2">
                                <FaArrowLeft /> Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
