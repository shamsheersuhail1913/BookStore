import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaStar, FaTag, FaBoxOpen } from "react-icons/fa";
import api from "../services/api";

const PLACEHOLDER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=800&fit=crop&auto=format";

function StarRating({ rating = 4 }) {
    return (
        <span className="rating-stars">
            {[1,2,3,4,5].map(i => (
                <FaStar key={i} style={{ opacity: i <= rating ? 1 : 0.25 }} />
            ))}
            <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 6 }}>({rating}.0)</span>
        </span>
    );
}

function BookDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding]   = useState(false);

    useEffect(() => { fetchBook(); }, [id]);

    async function fetchBook() {
        try {
            const res = await api.get(`/books/${id}`);
            setBook(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function addToCart() {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        setAdding(true);
        try {
            await api.post("/cart", { bookId: book._id, quantity: 1 });
            navigate("/cart");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add to cart");
        } finally {
            setAdding(false);
        }
    }

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-md-4">
                            <div className="skeleton" style={{ height: 420, borderRadius: 16 }} />
                        </div>
                        <div className="col-md-8">
                            {[200, 120, 80, 300, 60].map((w, i) => (
                                <div key={i} className="skeleton mb-3" style={{ height: i === 0 ? 36 : 18, width: `${w}px`, maxWidth: "100%" }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="page-wrapper">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">📚</div>
                        <h4>Book not found</h4>
                        <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    const imgSrc  = book.image && book.image.trim() !== "" ? book.image : PLACEHOLDER;
    const inStock = book.stock > 0;

    return (
        <div className="page-wrapper">
            <div className="container">
                {/* Back */}
                <button className="btn btn-outline-secondary btn-sm mb-4" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>

                <div className="row g-5 fade-in">
                    {/* Image */}
                    <div className="col-md-4 text-center">
                        <img src={imgSrc} alt={book.title} className="book-detail-img" style={{ maxHeight: 460 }} />
                    </div>

                    {/* Info */}
                    <div className="col-md-8">
                        {book.category && (
                            <span className="badge mb-3" style={{ background: "var(--primary-light)", color: "var(--primary)", fontSize: 12 }}>
                                <FaTag style={{ marginRight: 4 }} />{book.category}
                            </span>
                        )}

                        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>{book.title}</h1>
                        <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 12 }}>by <strong>{book.author}</strong></p>

                        <StarRating rating={4} />

                        <hr style={{ margin: "20px 0", borderColor: "var(--border)" }} />

                        {/* Price */}
                        <div className="d-flex align-items-baseline gap-3 mb-3">
                            <span style={{ fontSize: 36, fontWeight: 800, color: "var(--primary)" }}>₹{book.price}</span>
                            <span style={{ fontSize: 18, color: "var(--text-muted)", textDecoration: "line-through" }}>
                                ₹{Math.round(book.price * 1.2)}
                            </span>
                            <span className="badge" style={{ background: "#DCFCE7", color: "#166534" }}>17% OFF</span>
                        </div>

                        {/* Stock */}
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <FaBoxOpen style={{ color: inStock ? "var(--success)" : "var(--danger)" }} />
                            <span style={{ fontSize: 14, fontWeight: 600, color: inStock ? "var(--success)" : "var(--danger)" }}>
                                {inStock ? `In Stock (${book.stock} available)` : "Out of Stock"}
                            </span>
                        </div>

                        {/* Description */}
                        {book.description && (
                            <div className="mb-4">
                                <h6 style={{ fontWeight: 700, marginBottom: 8 }}>About this book</h6>
                                <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text)" }}>{book.description}</p>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="d-flex gap-3 flex-wrap">
                            <button
                                className="btn btn-primary btn-lg px-5"
                                onClick={addToCart}
                                disabled={!inStock || adding}
                            >
                                {adding
                                    ? <><span className="spinner-border spinner-border-sm me-2" />Adding...</>
                                    : <><FaShoppingCart /> Add to Cart</>
                                }
                            </button>
                            <Link to="/" className="btn btn-outline-secondary btn-lg">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookDetails;
