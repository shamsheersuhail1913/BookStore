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

    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    const name  = localStorage.getItem("name");

    const initials = name ? name.charAt(0).toUpperCase() : "U";

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        navigate("/login");
    }

    function handleSearch(e) {
        e.preventDefault();
        if (onSearch) onSearch(searchVal);
        if (location.pathname !== "/") navigate("/");
    }

    return (
        <nav className="app-navbar navbar navbar-expand-lg">
            <div className="container">
                {/* Brand */}
                <Link className="navbar-brand" to="/">
                    <FaBook style={{ color: "#60A5FA" }} />
                    BookStore
                </Link>

                {/* Mobile toggle */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    style={{ color: "#fff" }}
                >
                    <span style={{ fontSize: 22 }}>☰</span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    {/* Search bar */}
                    <form className="mx-auto my-2 my-lg-0 position-relative" onSubmit={handleSearch} style={{ flex: "0 0 auto" }}>
                        <FaSearch style={{
                            position: "absolute", left: 10, top: "50%",
                            transform: "translateY(-50%)", color: "rgba(255,255,255,0.45)", fontSize: 13
                        }} />
                        <input
                            className="nav-search"
                            type="text"
                            placeholder="Search books, authors..."
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                        />
                    </form>

                    {/* Right nav */}
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
                        <li className="nav-item">
                            <Link className="nav-link" to="/"><FaHome /> Home</Link>
                        </li>

                        {!token && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login"><FaUser /> Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="btn btn-primary btn-sm ms-1">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}

                        {token && role === "customer" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart"><FaShoppingCart /> Cart</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders"><FaClipboardList /> Orders</Link>
                                </li>
                            </>
                        )}

                        {token && role === "seller" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/seller"><FaTachometerAlt /> Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/seller/add-book"><FaPlusCircle /> Add Book</Link>
                                </li>
                            </>
                        )}

                        {token && role === "admin" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin"><FaTachometerAlt /> Admin</Link>
                            </li>
                        )}

                        {token && (
                            <li className="nav-item d-flex align-items-center gap-2 ms-2">
                                <div className="user-avatar" title={name}>{initials}</div>
                                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>
                                    {name}
                                </span>
                                <button className="btn-logout ms-1" onClick={logout}>
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
