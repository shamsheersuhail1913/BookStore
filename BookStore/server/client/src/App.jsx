import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home            from "./pages/Home";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import BookDetails     from "./pages/BookDetails";
import Cart            from "./pages/Cart";
import Orders          from "./pages/Orders";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard  from "./pages/AdminDashboard";
import AddBook         from "./pages/AddBook";
import EditBook        from "./pages/EditBook";

import Navbar         from "./components/Navbar";
import Footer         from "./components/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Public */}
                <Route path="/"         element={<Home />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/book/:id" element={<BookDetails />} />

                {/* Customer */}
                <Route path="/cart" element={
                    <ProtectedRoute allowedRoles={["customer"]}><Cart /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute allowedRoles={["customer"]}><Orders /></ProtectedRoute>
                } />

                {/* Seller */}
                <Route path="/seller" element={
                    <ProtectedRoute allowedRoles={["seller"]}><SellerDashboard /></ProtectedRoute>
                } />
                <Route path="/seller/add-book" element={
                    <ProtectedRoute allowedRoles={["seller"]}><AddBook /></ProtectedRoute>
                } />
                <Route path="/seller/edit/:id" element={
                    <ProtectedRoute allowedRoles={["seller"]}><EditBook /></ProtectedRoute>
                } />

                {/* Admin */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>
                } />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;
