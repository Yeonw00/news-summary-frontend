import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../.css";
import { User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
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

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
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

            <nav className="nav-buttons">
                <div className="relative" ref={menuRef}>
                    <User 
                        className="cursor-pointer"
                        size={24}
                        onClick={() => setMenuOpen(prev => !prev)}
                    />
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded z-50">
                            <button
                                onClick={() => { navigate("/profile"); setMenuOpen(false);}}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                회원정보 수정
                            </button>
                            <button
                                onClick={() => { navigate("/payment"); setMenuOpen(false);}}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                결제하기
                            </button>
                        </div>
                    )}
                </div>
                <button onClick={handleLogout}>로그아웃</button>
            </nav>
        </header>
    );
}

export default Header;