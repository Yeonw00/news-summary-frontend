import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

function ArticleSearch({selectedView, setSelectedView}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect (() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setSelectedView("summary");
            }
        };
        
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setSelectedView]);

    const handleSearch = async () => {
        if (!query.trim()) return;
        try {
            const data = await apiFetch(`/api/summary/search?keyword=${encodeURIComponent(query)}`, {
                method: "GET",
            });

            setResults(data ?? []);
        } catch (err) {
            console.error("검색 실패:", err.message);
            setResults([]);
        }
    };

    const handleSelect = (requestId) => {
        navigate(`/summary/${requestId}`);
        setSelectedView('summary');
    };

    const handleExit = () => {
        setSelectedView('summary');
    };

    return (
        <div className="floating-search-overlay">
            <div className="floating-search-box">
                <div className="exit-container">
                    <button className="exit-button" onClick={handleExit}>×</button>
                </div>
                <h2>기사 검색</h2>
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button onClick={handleSearch}></button>
                <div className="search-results">
                    {results.map((item) => (
                        <div className="search-result-item">
                            <div 
                                key={item.id} 
                                className="search-result-title"
                                onClick={() => handleSelect(item.id)}
                            >
                                <strong>{item.title}</strong>
                            </div>
                            <div className="search-result-url">
                                <a href={item.url} target="_blank" rel="noopenr noreferrer">
                                    {item.url.length > 55 ? item.url.slice(0, 55) + "..." : item.url}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ArticleSearch;