import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // User is not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // User doesn't have permission
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    // User has permission
    return children;
}

export default ProtectedRoute;