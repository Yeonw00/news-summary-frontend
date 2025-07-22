import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ArticleSearch({selectedView, setSelectedView}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query.trim()) return;
        try {
            const res = await fetch(`http://localhost:8080/api/summary/search?keyword=${encodeURIComponent(query)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            if(!res.ok) {
                const text = await res.text();
                console.error("서버 응답 오류:", res.status, text);
                return;
            }

            const text = await res.text();
            if (!text) {
                setResults([]);
                return;
            }

            const data = JSON.parse(text);
            setResults(data);
        } catch (err) {
            console.error("검색 실패:", err.message);
        }
    }

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