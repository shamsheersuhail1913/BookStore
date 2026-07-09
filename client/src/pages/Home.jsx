import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import BookCard from "../components/BookCard";
import { BookCardSkeleton } from "../components/Loader";
import { FaSearch, FaSortAmountDown, FaFilter, FaBookOpen } from "react-icons/fa";

const PAGE_SIZE = 9;

function Home() {
    const [books, setBooks]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort]         = useState("newest");
    const [page, setPage]         = useState(1);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/books?limit=100");
            setBooks(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBooks(); }, [fetchBooks]);

    // Build categories dynamically from actual book data
    const categories = ["All", ...new Set(books.map(b => b.category).filter(Boolean))];

    // Filter + search + sort
    const filtered = books
        .filter(b => category === "All" || b.category === category)
        .filter(b => {
            const q = search.toLowerCase();
            return b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q);
        })
        .sort((a, b) => {
            if (sort === "price-asc")  return a.price - b.price;
            if (sort === "price-desc") return b.price - a.price;
            return 0;
        });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function handleSearch(e) { e.preventDefault(); setPage(1); }
    function handleCategory(cat) { setCategory(cat); setPage(1); }
    function handleSort(e) { setSort(e.target.value); setPage(1); }

    return (
        <>
            {/* Hero */}
            <section className="hero-section">
                <div className="container position-relative">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <p style={{ color: "#93C5FD", fontWeight: 600, fontSize: 14, marginBottom: 8, letterSpacing: 1 }}>
                                📚 WELCOME TO BOOKSTORE
                            </p>
                            <h1 className="hero-title">Discover Your Next<br />Favourite Book</h1>
                            <p className="hero-subtitle">
                                Thousands of titles across every genre — from bestsellers to hidden gems.
                            </p>
                            <form className="hero-search-bar" onSubmit={handleSearch}>
                                <FaSearch style={{ color: "#94A3B8", flexShrink: 0 }} />
                                <input
                                    type="text"
                                    placeholder="Search by title or author..."
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                                />
                                <button type="submit" className="btn btn-primary">Search</button>
                            </form>
                        </div>
                        <div className="col-lg-5 d-none d-lg-flex justify-content-end">
                            <div style={{ fontSize: 140, opacity: 0.15, lineHeight: 1 }}>📚</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <div className="page-wrapper">
                <div className="container">

                    {/* Category chips — dynamic from DB */}
                    <div className="d-flex gap-2 flex-wrap mb-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`category-chip ${category === cat ? "active" : ""}`}
                                onClick={() => handleCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <FaFilter style={{ color: "var(--text-muted)" }} />
                            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                                {loading ? "Loading..." : `${filtered.length} book${filtered.length !== 1 ? "s" : ""} found`}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <FaSortAmountDown style={{ color: "var(--text-muted)" }} />
                            <select className="form-select form-select-sm" style={{ width: "auto" }} value={sort} onChange={handleSort}>
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Book grid */}
                    {loading ? (
                        <div className="row g-4">
                            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                <div className="col-sm-6 col-lg-4" key={i}>
                                    <BookCardSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : paginated.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FaBookOpen /></div>
                            <h4>No Books Found</h4>
                            <p>Try a different search term or category.</p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {paginated.map((book, i) => (
                                <div className="col-sm-6 col-lg-4" key={book._id}
                                    style={{ animationDelay: `${i * 0.04}s` }}>
                                    <BookCard book={book} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <nav className="mt-5 d-flex justify-content-center">
                            <ul className="pagination">
                                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => setPage(p => p - 1)}>‹ Prev</button>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => setPage(p => p + 1)}>Next ›</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </>
    );
}

export default Home;
