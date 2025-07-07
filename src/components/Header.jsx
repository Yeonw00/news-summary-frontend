import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../.css";

function Header() {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async() => {
        const confirmLogout = window.confirm("정말 로그아웃 하시겠습니까?");
        if (!confirmLogout) return;

        const res = await fetch('http://localhost:8080/api/auth/logout', {
            method: "POST",
            credentials: "include"
        })

        if(res.ok) {
            setIsLoggedIn(false);
            localStorage.removeItem("user");
            navigate("/");
        }
    };

    return (
        <header className="main-header">
            <div className="logo" onClick={() => navigate("/")}>
                News Summary
            </div>

            <nav className="nav-buttons">
                <button onClick={handleLogout}>로그아웃</button>
            </nav>
        </header>
    );
}

export default Header;