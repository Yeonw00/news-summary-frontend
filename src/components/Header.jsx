import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../.css";
import { User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async() => {
        const confirmLogout = window.confirm("정말 로그아웃 하시겠습니까?");
        if (!confirmLogout) return;

        const res = await fetch('http://localhost:8080/api/auth/logout', {
            method: "POST",
        })

        if(res.ok) {
            setIsLoggedIn(false);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])

    return (
        <header className="main-header">
            <div className="logo" onClick={() => navigate("/")}>
                News Summary
            </div>

            <div className="menu-group">
                <div className="dropdown" ref={menuRef}>
                    <User 
                        className="user-icon"
                        size={24}
                        onClick={() => setMenuOpen(!menuOpen)}
                    />
                    {menuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={() => { navigate("/profile"); setMenuOpen(false);}}>
                                회원정보 수정
                            </button>
                            <button onClick={() => { navigate("/payment"); setMenuOpen(false);}}>
                                결제하기
                            </button>
                        </div>
                    )}
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </header>
    );
}

export default Header;