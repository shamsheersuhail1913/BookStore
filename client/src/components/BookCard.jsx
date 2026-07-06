import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const PLACEHOLDER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop&auto=format";

function BookCard({ book }) {
    const imgSrc = book.image && book.image.trim() !== "" ? book.image : PLACEHOLDER;
    const inStock = book.stock > 0;

    return (
        <div className="book-card fade-in">
            <div className="book-img-wrapper">
                <img src={imgSrc} alt={book.title} loading="lazy" />
                {!inStock && (
                    <span style={{
                        position: "absolute", top: 10, right: 10,
                        background: "rgba(239,68,68,0.9)", color: "#fff",
                        fontSize: 11, fontWeight: 600, padding: "3px 8px",
                        borderRadius: 20
                    }}>Out of Stock</span>
                )}
            </div>

            <div className="book-body">
                {book.category && (
                    <div className="book-category">{book.category}</div>
                )}
                <div className="book-title">{book.title}</div>
                <div className="book-author">by {book.author}</div>
                <div className="mt-auto">
                    <div className="book-price">₹{book.price}</div>
                    <div className={`book-stock ${inStock ? "text-success" : "text-danger"}`}>
                        {inStock ? `${book.stock} in stock` : "Out of stock"}
                    </div>
                </div>
            </div>

            <div className="book-footer">
                <Link
                    to={`/book/${book._id}`}
                    className="btn btn-primary btn-sm w-100"
                >
                    <FaEye /> View Details
                </Link>
            </div>
        </div>
    );
}

export default BookCard;
