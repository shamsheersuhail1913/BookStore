
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaBook, FaShoppingCart, FaUser, FaSignOutAlt,
    FaTachometerAlt, FaClipboardList, FaPlusCircle, FaSearch, FaHome
} from "react-icons/fa";

function Navbar({ onSearch }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchVal, setSearchVal] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    const initials = name ? name.charAt(0).toUpperCase() : "U";

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        closeMenu();
        navigate("/login");
    }

    function handleSearch(e) {
        e.preventDefault();

        if (onSearch) onSearch(searchVal);

        if (location.pathname !== "/") navigate("/");

        closeMenu();
    }

    return (
        <nav className="app-navbar navbar navbar-expand-lg">
            <div className="container">

                {/* Brand */}
                <Link className="navbar-brand" to="/" onClick={closeMenu}>
                    <FaBook style={{ color: "#60A5FA" }} />
                    BookStore
                </Link>

                {/* Mobile toggle */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                    style={{ color: "#fff" }}
                >
                    <span style={{ fontSize: 22 }}>☰</span>
                </button>

                {/* Navigation content */}
                <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>

                    {/* Search bar */}
                    <form
                        className="mx-auto my-2 my-lg-0 position-relative"
                        onSubmit={handleSearch}
                        style={{ flex: "0 0 auto" }}
                    >
                        <FaSearch
                            style={{
                                position: "absolute",
                                left: 10,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "rgba(255,255,255,0.45)",
                                fontSize: 13
                            }}
                        />

                        <input
                            className="nav-search"
                            type="text"
                            placeholder="Search books, authors..."
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                        />
                    </form>

                    {/* Right navigation */}
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-1">

                        <li className="nav-item">
                            <Link className="nav-link" to="/" onClick={closeMenu}>
                                <FaHome /> Home
                            </Link>
                        </li>

                        {!token && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login" onClick={closeMenu}>
                                        <FaUser /> Login
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to="/register"
                                        className="btn btn-primary btn-sm ms-1"
                                        onClick={closeMenu}
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}

                        {token && role === "customer" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart" onClick={closeMenu}>
                                        <FaShoppingCart /> Cart
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders" onClick={closeMenu}>
                                        <FaClipboardList /> Orders
                                    </Link>
                                </li>
                            </>
                        )}

                        {token && role === "seller" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/seller" onClick={closeMenu}>
                                        <FaTachometerAlt /> Dashboard
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/seller/add-book"
                                        onClick={closeMenu}
                                    >
                                        <FaPlusCircle /> Add Book
                                    </Link>
                                </li>
                            </>
                        )}

                        {token && role === "admin" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin" onClick={closeMenu}>
                                    <FaTachometerAlt /> Admin
                                </Link>
                            </li>
                        )}

                        {token && (
                            <li className="nav-item d-flex align-items-center gap-2 ms-2">
                                <div className="user-avatar" title={name}>
                                    {initials}
                                </div>

                                <span
                                    style={{
                                        color: "rgba(255,255,255,0.8)",
                                        fontSize: 13,
                                        fontWeight: 500
                                    }}
                                >
                                    {name}
                                </span>

                                <button
                                    className="btn-logout ms-1"
                                    onClick={logout}
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </li>
                        )}

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
