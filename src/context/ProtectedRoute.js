import { useAuth } from "./AuthContext";
import Home from "../components/Home";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const {isLoggedIn, isChecking} = useAuth();
    const token = localStorage.getItem("token");

    if (isChecking) return null;

    if(!token || !isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return isLoggedIn ? children : <Home />;
}

export default ProtectedRoute;