import { Link, useNavigate } from "react-router-dom";
import "../.css";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect  } from "react";

function Sidebar({ onSelect }) {
    const [summaries, setSummaries] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const { isLoggedIn } = useAuth();
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingId, setEditingId] = useState(null); 
    const [editTitle, setEditTitle] = useState("");

    const navigate = useNavigate();

    // const handleLogout = () =>  {
    //     setIsLoggedIn(false);
    // };

    useEffect(() => {
        if(!isLoggedIn) return;

        fetch("http://localhost:8080/api/summary/list", {
            credentials: "include"
        })
            .then((res) => {
                if (!res.ok) throw new Error("요약 목록 로딩 실패");
                return res.json();
            })
            .then(setSummaries)
            .catch((err) => {
                console.error(err);
            })
    }, [isLoggedIn]);

    const handleMenuToggle = (id, e) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleTitleChange = async (id) => {
        if (editTitle.trim() === "") return;

        await fetch(`http://localhost:8080/api/summary/${id}/title`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ title: editTitle })
        });

        setSummaries((prev) => prev.map((item) => item.id === id ? { ...item, title: editTitle} : item));
        setEditingId(null);
    };

    return(
        <div className={`sidebar ${isOpen ? "open": "closed"}`}>
            <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "←" : "→"}
            </button>
            <div className="sidebar-body">
                {isOpen && (
                    <div>
                    <nav>
                        <ul>
                            <li><Link to="/summary">새 요약</Link></li>
                        </ul>
                    </nav>
                    <br />
                        <div className="summary-list">
                            {summaries.map((item) => (
                                <div key={item.id} className="summary-item">
                                    {editingId === item.id ? (
                                        <input
                                          autoFocus
                                          value={editTitle}
                                          onChange={(e) => setEditTitle(e.target.value)}
                                          onBlur={() => handleTitleChange(item.id)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") handleTitleChange(item.id);
                                          }}
                                        />
                                        ): (
                                        <span 
                                        className="summary-title"
                                        onClick={() => navigate(`/summary/${item.id}`)}
                                        >
                                            {item.title ? item.title : item.originalContent}
                                        </span>
                                     )}
                                     
                                <div 
                                    className="menu-button"
                                    onClick={(e) => handleMenuToggle(item.id, e)}
                                >
                                    ⋯
                                    {openMenuId === item.id && (
                                        <div className="action-menu">
                                            <div
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingId(item.id);
                                                setEditTitle("");
                                             }}
                                            >
                                            수정
                                            </div>
                                            <div onClick={() => alert("삭제 기능")}>삭제</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;