import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaImage, FaArrowLeft } from "react-icons/fa";
import api from "../services/api";

const CATEGORIES = ["Fiction", "Non-Fiction", "Science", "History", "Technology", "Biography", "Fantasy", "Romance", "Mystery", "Other"];

function AddBook() {
    const navigate = useNavigate();
    const [book, setBook] = useState({ title: "", author: "", description: "", price: "", category: "", stock: "" });
    const [image, setImage]       = useState(null);
    const [preview, setPreview]   = useState(null);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState("");

    function handleChange(e) {
        setBook({ ...book, [e.target.name]: e.target.value });
    }

    function handleImage(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(""); setLoading(true);
        const formData = new FormData();
        Object.keys(book).forEach(k => formData.append(k, book[k]));
        if (image) formData.append("image", image);
        try {
            await api.post("/books", formData);
            navigate("/seller");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add book.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-wrapper">
            <div className="container" style={{ maxWidth: 760 }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>
                    <h2 style={{ margin: 0 }}><FaPlusCircle style={{ color: "var(--success)", marginRight: 8 }} />Add New Book</h2>
                </div>

                {error && (
                    <div className="alert alert-danger mb-4" style={{ borderRadius: 10, fontSize: 14 }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        {/* Left: image */}
                        <div className="col-md-4">
                            <div className="form-card h-100">
                                <div className="form-section-title">Book Cover</div>
                                <div className="image-preview-box mb-3">
                                    {preview
                                        ? <img src={preview} alt="Preview" />
                                        : <div className="placeholder-text">
                                            <FaImage style={{ fontSize: 32, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                                            <div>Click below to upload</div>
                                          </div>
                                    }
                                </div>
                                <label className="btn btn-outline-primary w-100 btn-sm">
                                    <FaImage /> Choose Image
                                    <input type="file" accept="image/*" onChange={handleImage} hidden />
                                </label>
                            </div>
                        </div>

                        {/* Right: fields */}
                        <div className="col-md-8">
                            <div className="form-card">
                                <div className="form-section-title">Book Details</div>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">Title <span className="text-danger">*</span></label>
                                        <input name="title" className="form-control" placeholder="Book title" value={book.title} onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Author <span className="text-danger">*</span></label>
                                        <input name="author" className="form-control" placeholder="Author name" value={book.author} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Price (₹) <span className="text-danger">*</span></label>
                                        <input name="price" type="number" min="0" className="form-control" placeholder="0" value={book.price} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Stock <span className="text-danger">*</span></label>
                                        <input name="stock" type="number" min="0" className="form-control" placeholder="0" value={book.stock} onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Category</label>
                                        <select name="category" className="form-select" value={book.category} onChange={handleChange}>
                                            <option value="">Select category</option>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Description</label>
                                        <textarea name="description" className="form-control" rows={4} placeholder="Brief description of the book..." value={book.description} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-3 mt-4 justify-content-end">
                        <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-success px-5" disabled={loading}>
                            {loading
                                ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                                : <><FaPlusCircle /> Add Book</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBook;
