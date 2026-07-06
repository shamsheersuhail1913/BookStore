import { Link } from "react-router-dom";
import { FaBook, FaGithub } from "react-icons/fa";

function Footer() {
    return (
        <footer className="app-footer">
            <div className="container">
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="footer-brand d-flex align-items-center gap-2">
                            <FaBook style={{ color: "#60A5FA" }} /> BookStore
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>
                            Your one-stop destination for books across all genres. Discover, buy, and enjoy reading.
                        </p>
                    </div>
                    <div className="col-md-2 offset-md-2">
                        <div style={{ fontWeight: 600, color: "#fff", marginBottom: 12, fontSize: 14 }}>Shop</div>
                        <Link className="footer-link" to="/">All Books</Link>
                        <Link className="footer-link" to="/cart">Cart</Link>
                        <Link className="footer-link" to="/orders">My Orders</Link>
                    </div>
                    <div className="col-md-2">
                        <div style={{ fontWeight: 600, color: "#fff", marginBottom: 12, fontSize: 14 }}>Account</div>
                        <Link className="footer-link" to="/login">Login</Link>
                        <Link className="footer-link" to="/register">Register</Link>
                    </div>
                    <div className="col-md-2">
                        <div style={{ fontWeight: 600, color: "#fff", marginBottom: 12, fontSize: 14 }}>Sell</div>
                        <Link className="footer-link" to="/seller">Seller Dashboard</Link>
                        <Link className="footer-link" to="/seller/add-book">Add Book</Link>
                    </div>
                </div>
                <div className="footer-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span>© {new Date().getFullYear()} BookStore. All rights reserved.</span>
                    <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.6)" }}>
                        <FaGithub size={18} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
