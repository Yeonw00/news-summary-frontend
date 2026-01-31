import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRoute() {
    const { isLoggedIn, isChecking, currentUser } = useAuth();

    if (isChecking) return null;

    if (!isLoggedIn) return <Navigate to="/" replace />;

    if (currentUser?.role !== "ADMIN") return <Navigate to="/" replace />;

    return <Outlet />;
}

export default AdminRoute;