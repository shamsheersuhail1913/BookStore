import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaPlusCircle, FaEdit, FaTrash, FaTachometerAlt } from "react-icons/fa";
import { TableRowSkeleton } from "../components/Loader";
import api from "../services/api";

const PLACEHOLDER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=260&fit=crop&auto=format";

function SellerDashboard() {
    const [books, setBooks]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [deleteId, setDeleteId]   = useState(null);
    const [deleting, setDeleting]   = useState(false);

    useEffect(() => { fetchMyBooks(); }, []);

    async function fetchMyBooks() {
        try {
            const res = await api.get("/books/seller/my-books");
            setBooks(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function confirmDelete() {
        setDeleting(true);
        try {
            await api.delete(`/books/${deleteId}`);
            setBooks(prev => prev.filter(b => b._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        } finally {
            setDeleting(false);
        }
    }

    const totalValue = books.reduce((s, b) => s + b.price * b.stock, 0);

    return (
        <div className="page-wrapper">
            <div className="container">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h2 style={{ margin: 0 }}>
                        <FaTachometerAlt style={{ color: "var(--primary)", marginRight: 8 }} />
                        Seller Dashboard
                    </h2>
                    <Link to="/seller/add-book" className="btn btn-success">
                        <FaPlusCircle /> Add New Book
                    </Link>
                </div>

                {/* Stat cards */}
                <div className="row g-3 mb-5">
                    <div className="col-sm-4">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: "#EFF6FF" }}>
                                <FaBook style={{ color: "var(--primary)" }} />
                            </div>
                            <div className="stat-value">{books.length}</div>
                            <div className="stat-label">Total Books Listed</div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: "#F0FDF4" }}>
                                <span style={{ color: "var(--success)", fontSize: 22 }}>📦</span>
                            </div>
                            <div className="stat-value">{books.reduce((s, b) => s + b.stock, 0)}</div>
                            <div className="stat-label">Total Stock Units</div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: "#FFFBEB" }}>
                                <span style={{ color: "var(--warning)", fontSize: 22 }}>₹</span>
                            </div>
                            <div className="stat-value">₹{totalValue.toLocaleString()}</div>
                            <div className="stat-label">Inventory Value</div>
                        </div>
                    </div>
                </div>

                {/* Books table */}
                <h5 className="section-title">My Books</h5>

                {loading ? (
                    <div className="table-wrapper">
                        <table className="table table-striped">
                            <thead><tr><th>Book</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                            <tbody>{[1,2,3].map(i => <TableRowSkeleton key={i} cols={5} />)}</tbody>
                        </table>
                    </div>
                ) : books.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><FaBook /></div>
                        <h4>No books listed yet</h4>
                        <p>Start by adding your first book.</p>
                        <Link to="/seller/add-book" className="btn btn-primary mt-3">
                            <FaPlusCircle /> Add Book
                        </Link>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <div className="table-responsive">
                            <table className="table table-striped mb-0">
                                <thead>
                                    <tr>
                                        <th>Book</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th style={{ width: 140 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map(book => (
                                        <tr key={book._id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <img
                                                        src={book.image?.trim() || PLACEHOLDER}
                                                        alt={book.title}
                                                        style={{ width: 40, height: 52, objectFit: "cover", borderRadius: 6 }}
                                                    />
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{book.title}</div>
                                                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>by {book.author}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                                                    {book.category || "—"}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: 700, color: "var(--primary)" }}>₹{book.price}</td>
                                            <td>
                                                <span className={`badge ${book.stock > 0 ? "" : ""}`}
                                                    style={{
                                                        background: book.stock > 0 ? "#DCFCE7" : "#FEE2E2",
                                                        color: book.stock > 0 ? "#166534" : "#991B1B"
                                                    }}>
                                                    {book.stock}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Link to={`/seller/edit/${book._id}`} className="btn btn-warning btn-sm">
                                                        <FaEdit />
                                                    </Link>
                                                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(book._id)}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete confirmation modal */}
            {deleteId && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: 16, border: "none" }}>
                            <div className="modal-body text-center p-5">
                                <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
                                <h5 style={{ fontWeight: 700, marginBottom: 8 }}>Delete this book?</h5>
                                <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
                                    This action cannot be undone.
                                </p>
                                <div className="d-flex gap-3 justify-content-center">
                                    <button className="btn btn-outline-secondary px-4" onClick={() => setDeleteId(null)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-danger px-4" onClick={confirmDelete} disabled={deleting}>
                                        {deleting ? <span className="spinner-border spinner-border-sm" /> : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellerDashboard;
