import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaImage, FaArrowLeft } from "react-icons/fa";
import api from "../services/api";

const CATEGORIES = ["Fiction", "Non-Fiction", "Science", "History", "Technology", "Biography", "Fantasy", "Romance", "Mystery", "Other"];

function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook]       = useState({ title: "", author: "", description: "", category: "", price: "", stock: "" });
    const [image, setImage]     = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError]     = useState("");

    useEffect(() => {
        api.get(`/books/${id}`)
            .then(res => {
                const d = res.data.data;
                setBook({ title: d.title, author: d.author, description: d.description, category: d.category, price: d.price, stock: d.stock });
                if (d.image) setPreview(d.image);
            })
            .catch(console.error)
            .finally(() => setFetching(false));
    }, [id]);

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
        try {
            if (image) {
                const formData = new FormData();
                Object.keys(book).forEach(k => formData.append(k, book[k]));
                formData.append("image", image);
                await api.put(`/books/${id}`, formData);
            } else {
                await api.put(`/books/${id}`, book);
            }
            navigate("/seller");
        } catch (err) {
            setError(err.response?.data?.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div className="page-wrapper">
                <div className="container" style={{ maxWidth: 760 }}>
                    <div className="skeleton mb-4" style={{ height: 40, width: 200 }} />
                    <div className="row g-4">
                        <div className="col-md-4"><div className="skeleton" style={{ height: 300, borderRadius: 12 }} /></div>
                        <div className="col-md-8"><div className="skeleton" style={{ height: 300, borderRadius: 12 }} /></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="container" style={{ maxWidth: 760 }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>
                    <h2 style={{ margin: 0 }}><FaEdit style={{ color: "var(--warning)", marginRight: 8 }} />Edit Book</h2>
                </div>

                {error && (
                    <div className="alert alert-danger mb-4" style={{ borderRadius: 10, fontSize: 14 }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="form-card h-100">
                                <div className="form-section-title">Book Cover</div>
                                <div className="image-preview-box mb-3">
                                    {preview
                                        ? <img src={preview} alt="Preview" />
                                        : <div className="placeholder-text">
                                            <FaImage style={{ fontSize: 32, display: "block", margin: "0 auto 8px" }} />
                                            <div>No image</div>
                                          </div>
                                    }
                                </div>
                                <label className="btn btn-outline-primary w-100 btn-sm">
                                    <FaImage /> Change Image
                                    <input type="file" accept="image/*" onChange={handleImage} hidden />
                                </label>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <div className="form-card">
                                <div className="form-section-title">Book Details</div>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label">Title</label>
                                        <input name="title" className="form-control" value={book.title} onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Author</label>
                                        <input name="author" className="form-control" value={book.author} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Price (₹)</label>
                                        <input name="price" type="number" min="0" className="form-control" value={book.price} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Stock</label>
                                        <input name="stock" type="number" min="0" className="form-control" value={book.stock} onChange={handleChange} required />
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
                                        <textarea name="description" className="form-control" rows={4} value={book.description} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-3 mt-4 justify-content-end">
                        <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-warning px-5" disabled={loading}>
                            {loading
                                ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                                : <><FaEdit /> Update Book</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBook;
