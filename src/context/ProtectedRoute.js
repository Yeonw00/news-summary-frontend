import { useAuth } from "./AuthContext";
import Home from "../components/Home";

function ProtectedRoute({ children }) {
    const {isLoggedIn, isChecking} = useAuth();

    if (isChecking) return null;

    return isLoggedIn ? children : <Home />;
}

export default ProtectedRoute;