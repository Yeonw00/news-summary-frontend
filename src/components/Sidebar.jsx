import { useNavigate } from "react-router-dom";
import "../.css";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect  } from "react";
import SummaryItem from "./SummaryItem";

function Sidebar({ selectedView, setSelectedView }) {
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
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
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

    const updateTitle = async (id, newTitle) => {
        if (newTitle.trim() === "") return;

        await fetch(`http://localhost:8080/api/summary/${id}/title`, {
            method: "PATCH",
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ title: newTitle})
        });

        setEditingId(null);
        setSummaries((prev) => 
            prev.map((item) => (item.id === id ? {...item, title: newTitle} : item))
        );
    };

    const deleteSummary = async (id) => {
        await fetch(`http://localhost:8080/api/summary/delete/${id}`, {
            method: "DELETE",
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        });

        setEditingId(null);
        setSummaries((prev) => prev.filter((item) => item.id !== id));
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
                                    <button onClick={() => navigate('/summary')}>새 요약</button>
                                </li>
                                <li>
                                    <button onClick={() => setSelectedView("search")}>기사 검색</button>
                                </li>
                            </ul>
                        </nav>
                        <br />
                            <div className="summary-list">
                                {summaries.map((item) => (
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