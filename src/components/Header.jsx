import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../.css";
import { User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { GiTwoCoins } from "react-icons/gi";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { logout, balance } = useAuth();

    const handleLogout = async() => {
        const confirmLogout = window.confirm("정말 로그아웃 하시겠습니까?");
        if (!confirmLogout) return;

        await logout();
        navigate("/");
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
                    <div style={{ display: "flex", alignItems: "center", fontSize: "17px" }}>
                        <GiTwoCoins size={28} style={{ color: "gold", marginRight: "4px" }} />
                        {balance === null || balance === undefined ? "-" : balance.toLocaleString()}{" "}
                    </div>
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
                            <button onClick={() => { navigate("/charge"); setMenuOpen(false);}}>
                                코인 충전
                            </button>
                            <button onClick={() => { navigate("/coins/history"); setMenuOpen(false)}}> 
                                코인 사용 내역
                            </button>
                            <button onClick={() => {navigate("/coins/refund"); setMenuOpen(false)}}>
                                코인 환불
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