import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBook, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import api from "../services/api";

function Login() {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd]   = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role",  res.data.user.role);
            localStorage.setItem("name",  res.data.user.name);

            const role = res.data.user.role;
            if (role === "admin")       navigate("/admin");
            else if (role === "seller") navigate("/seller");
            else                        navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card fade-in">
                <div className="text-center mb-4">
                    <div className="auth-logo d-flex align-items-center justify-content-center gap-2">
                        <FaBook /> BookStore
                    </div>
                    <p className="auth-subtitle">Sign in to your account to continue</p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: 14, borderRadius: 8 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="input-icon-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                className="form-control"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <div className="input-icon-wrapper">
                            <FaLock className="input-icon" />
                            <input
                                type={showPwd ? "text" : "password"}
                                className="form-control has-right"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <span className="input-icon-right" onClick={() => setShowPwd(v => !v)}>
                                {showPwd ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2"
                        disabled={loading}
                    >
                        {loading
                            ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                            : <><FaSignInAlt /> Sign In</>
                        }
                    </button>
                </form>

                <p className="text-center mt-4" style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
