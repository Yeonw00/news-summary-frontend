import { useLocation, useNavigate } from "react-router-dom";
import "../.css";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect  } from "react";
import SummaryItem from "./SummaryItem";
import { apiFetch } from "../api/client";
import { Plus, Search } from "lucide-react";

function Sidebar({ summaries, fetchSummaryList, selectedView, setSelectedView }) {
    const [isOpen, setIsOpen] = useState(true);
    const { isLoggedIn } = useAuth();
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingId, setEditingId] = useState(null); 
    const [editTitle, setEditTitle] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // const handleLogout = () =>  {
    //     setIsLoggedIn(false);
    // };
    
    useEffect(() => {
        if(isLoggedIn) {
            fetchSummaryList();
        }
    }, [isLoggedIn, fetchSummaryList]);

    const updateTitle = async (id, newTitle) => {
        if (newTitle.trim() === "") return;

        try {
            await apiFetch(`/api/summary/${id}/title`, {
                method: "PATCH",
                body: JSON.stringify({ title: newTitle}),
            });
            setEditingId(null);
            await fetchSummaryList();
        } catch (err) {
            console.error("제목 수정 실패:", err.message);
            alert("제목 수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const deleteSummary = async (id) => {
        try {
            await apiFetch(`/api/summary/delete/${id}`, {
                method: "DELETE",
            });
            setEditingId(null);
            await fetchSummaryList();

            if(location.pathname === `/summary/${id}`) {
                navigate("/summary");
            }
        } catch (err) {
            console.error("요약 삭제 실패:", err.message);
            alert("삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return(
        <>
            <div className={`sidebar ${isOpen ? "open": "closed"}`}>
                <div className="sidebar-body">
                    {isOpen && (
                        <div>
                        <br />
                        <nav>
                            <ul>
                                <li >
                                    <button 
                                        className="sidebar-btn" 
                                        onClick={() => navigate('/summary')}
                                    >
                                        <Plus size={18} />
                                        새 요약
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="sidebar-btn" 
                                        onClick={() => setSelectedView("search")}
                                    >
                                        <Search size={18} />
                                        기사 검색
                                    </button>
                                </li>
                            </ul>
                        </nav>
                        <br />
                            <div className="summary-list">
                                {(summaries || []).map((item) => (
                                    <SummaryItem
                                        key={item.id}
                                        item={item}
                                        editingId={editingId}
                                        setEditingId={setEditingId}
                                        editTitle={editTitle}
                                        setEditTitle={setEditTitle}
                                        navigate={navigate}
                                        deleteSummary={deleteSummary}
                                        updateTitle={updateTitle}
                                        openMenuId={openMenuId}
                                        setOpenMenuId={setOpenMenuId}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button className="toggle-btn" 
                onClick={() => setIsOpen(!isOpen)} 
                style={{
                    left: isOpen ? "210px" : "10px",
                    top: "10px",
                }}
            >
                {isOpen ? "←" : "→"}
            </button>
        </>
    );
}

export default Sidebar;