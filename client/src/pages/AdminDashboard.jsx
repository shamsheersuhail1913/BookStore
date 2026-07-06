import { useEffect, useState } from "react";
import { FaUsers, FaBook, FaClipboardList, FaTachometerAlt } from "react-icons/fa";
import { TableRowSkeleton } from "../components/Loader";
import api from "../services/api";

const STATUSES = ["Pending", "Processing", "Delivered", "Cancelled"];

function StatusBadge({ status }) {
    const map = { Pending: "status-pending", Processing: "status-processing", Delivered: "status-delivered", Cancelled: "status-cancelled" };
    return <span className={`badge ${map[status] || "status-pending"}`} style={{ fontSize: 12 }}>{status}</span>;
}

function AdminDashboard() {
    const [users, setUsers]     = useState([]);
    const [books, setBooks]     = useState([]);
    const [orders, setOrders]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get("/auth/users"),
            api.get("/books?limit=100"),
            api.get("/orders"),
        ]).then(([u, b, o]) => {
            setUsers(u.data.data  || []);
            setBooks(b.data.data  || []);
            setOrders(o.data.data || []);
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, []);

    async function updateStatus(orderId, status) {
        try {
            await api.put(`/orders/${orderId}/status`, { orderStatus: status });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        }
    }

    const revenue = orders
        .filter(o => o.orderStatus === "Delivered")
        .reduce((s, o) => s + (o.totalAmount || 0), 0);

    return (
        <div className="page-wrapper">
            <div className="container">
                <h2 className="mb-4">
                    <FaTachometerAlt style={{ color: "var(--primary)", marginRight: 8 }} />
                    Admin Dashboard
                </h2>

                {/* Stat cards */}
                <div className="row g-3 mb-5">
                    {[
                        { icon: <FaUsers />, color: "#EFF6FF", iconColor: "var(--primary)", value: users.length, label: "Total Users" },
                        { icon: <FaBook />, color: "#F0FDF4", iconColor: "var(--success)", value: books.length, label: "Total Books" },
                        { icon: <FaClipboardList />, color: "#FFFBEB", iconColor: "var(--warning)", value: orders.length, label: "Total Orders" },
                        { icon: <span>₹</span>, color: "#FFF1F2", iconColor: "var(--danger)", value: `₹${revenue.toLocaleString()}`, label: "Revenue" },
                    ].map((s, i) => (
                        <div className="col-sm-6 col-xl-3" key={i}>
                            <div className="stat-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="stat-icon" style={{ background: s.color, color: s.iconColor }}>{s.icon}</div>
                                <div className="stat-value">{loading ? "—" : s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Users table */}
                <h5 className="section-title mb-3">
                    <FaUsers style={{ color: "var(--primary)" }} /> Users
                </h5>
                <div className="table-wrapper mb-5">
                    <div className="table-responsive">
                        <table className="table table-striped mb-0">
                            <thead>
                                <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th></tr>
                            </thead>
                            <tbody>
                                {loading
                                    ? [1,2,3].map(i => <TableRowSkeleton key={i} cols={4} />)
                                    : users.map((u, i) => (
                                        <tr key={u._id}>
                                            <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{i + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div style={{
                                                        width: 32, height: 32, borderRadius: "50%",
                                                        background: "var(--primary)", color: "#fff",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: 13, fontWeight: 700, flexShrink: 0
                                                    }}>
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 600 }}>{u.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ color: "var(--text-muted)", fontSize: 14 }}>{u.email}</td>
                                            <td>
                                                <span className="badge" style={{
                                                    background: u.role === "admin" ? "#FEE2E2" : u.role === "seller" ? "#FFFBEB" : "#EFF6FF",
                                                    color: u.role === "admin" ? "#991B1B" : u.role === "seller" ? "#92400E" : "#1E40AF",
                                                    textTransform: "capitalize"
                                                }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Orders table */}
                <h5 className="section-title mb-3">
                    <FaClipboardList style={{ color: "var(--warning)" }} /> Orders
                </h5>
                <div className="table-wrapper">
                    <div className="table-responsive">
                        <table className="table table-striped mb-0">
                            <thead>
                                <tr><th>#</th><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Update Status</th></tr>
                            </thead>
                            <tbody>
                                {loading
                                    ? [1,2,3].map(i => <TableRowSkeleton key={i} cols={6} />)
                                    : orders.map((order, i) => (
                                        <tr key={order._id}>
                                            <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{i + 1}</td>
                                            <td style={{ fontFamily: "monospace", fontSize: 13 }}>
                                                #{order._id?.slice(-8).toUpperCase()}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{order.user?.name || "—"}</td>
                                            <td style={{ fontWeight: 700, color: "var(--primary)" }}>₹{order.totalAmount}</td>
                                            <td><StatusBadge status={order.orderStatus} /></td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    style={{ width: 140 }}
                                                    value={order.orderStatus}
                                                    onChange={e => updateStatus(order._id, e.target.value)}
                                                >
                                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
