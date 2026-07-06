import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBook, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import api from "../services/api";

function getStrength(pwd) {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8)          score++;
    if (/[A-Z]/.test(pwd))        score++;
    if (/[0-9]/.test(pwd))        score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
        { label: "", color: "" },
        { label: "Weak",   color: "#EF4444" },
        { label: "Fair",   color: "#F59E0B" },
        { label: "Good",   color: "#3B82F6" },
        { label: "Strong", color: "#22C55E" },
    ];
    return { score, ...map[score] };
}

function Register() {
    const [form, setForm]           = useState({ name: "", email: "", password: "", role: "customer" });
    const [confirm, setConfirm]     = useState("");
    const [showPwd, setShowPwd]     = useState(false);
    const [showCfm, setShowCfm]     = useState(false);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState("");
    const navigate = useNavigate();

    const strength = getStrength(form.password);
    const pwdMatch = confirm === "" || form.password === confirm;

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (form.password !== confirm) { setError("Passwords do not match."); return; }
        setError(""); setLoading(true);
        try {
            await api.post("/auth/register", form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
                <div className="text-center mb-4">
                    <div className="auth-logo d-flex align-items-center justify-content-center gap-2">
                        <FaBook /> BookStore
                    </div>
                    <p className="auth-subtitle">Create your account to get started</p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: 14, borderRadius: 8 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <div className="input-icon-wrapper">
                            <FaUser className="input-icon" />
                            <input
                                type="text" name="name" className="form-control"
                                placeholder="John Doe"
                                value={form.name} onChange={handleChange} required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="input-icon-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email" name="email" className="form-control"
                                placeholder="you@example.com"
                                value={form.email} onChange={handleChange} required
                            />
                        </div>
                    </div>

                    <div className="mb-1">
                        <label className="form-label">Password</label>
                        <div className="input-icon-wrapper">
                            <FaLock className="input-icon" />
                            <input
                                type={showPwd ? "text" : "password"} name="password"
                                className="form-control has-right"
                                placeholder="Min. 8 characters"
                                value={form.password} onChange={handleChange} required
                            />
                            <span className="input-icon-right" onClick={() => setShowPwd(v => !v)}>
                                {showPwd ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    {/* Strength bar */}
                    {form.password && (
                        <div className="mb-3">
                            <div className="d-flex gap-1 mt-2">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="strength-bar flex-fill"
                                        style={{ background: i <= strength.score ? strength.color : "#E2E8F0" }} />
                                ))}
                            </div>
                            <div style={{ fontSize: 12, color: strength.color, marginTop: 4, fontWeight: 500 }}>
                                {strength.label}
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-icon-wrapper">
                            <FaLock className="input-icon" />
                            <input
                                type={showCfm ? "text" : "password"}
                                className={`form-control has-right ${confirm && !pwdMatch ? "is-invalid" : ""}`}
                                placeholder="Re-enter password"
                                value={confirm} onChange={e => setConfirm(e.target.value)} required
                            />
                            <span className="input-icon-right" onClick={() => setShowCfm(v => !v)}>
                                {showCfm ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {confirm && !pwdMatch && (
                            <div style={{ fontSize: 12, color: "var(--danger)", marginTop: 4 }}>Passwords do not match</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Register as</label>
                        <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading || !pwdMatch}>
                        {loading
                            ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
                            : <><FaUserPlus /> Create Account</>
                        }
                    </button>
                </form>

                <p className="text-center mt-4" style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
