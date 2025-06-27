import { Link } from "react-router-dom";
import "../.css";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect  } from "react";

function Sidebar({ onSelect }) {
    const [summaries, setSummaries] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const { isLoggedIn } = useAuth();

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
    }, [isLoggedIn])

    return(
        <div className={`sidebar ${isOpen ? "open": "closed"}`}>
            <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "←" : "→"}
            </button>
            {isOpen && (
                <>
                <nav>
                    <ul>
                        <li><Link to="/summary">새 요약</Link></li>
                    </ul>
                </nav>
                {summaries.map((item) => (
                    <div key={item.id} className="summary-title" onClick={() => onSelect(item.id)}>
                        {item.title}
                    </div>
                ))}
                </>
            )}
        </div>
    );
}

export default Sidebar;