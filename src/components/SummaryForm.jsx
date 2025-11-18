import { useState } from "react";
import "../.css";
import { apiFetchText } from "../api/client";
import { useAuth } from "../context/AuthContext";

function SummaryForm({ onSummarized }) {
    const { refreshBalance } = useAuth();
    const [url, setUrl] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');

    const handleSubmit = async () => {
        if(!url?.trim() && !content?.trim()) {
            alert("URL 또는 본문을 입력하세요.");
            return;
        }

        try {
            setSummary("");

            const text = await apiFetchText("/api/summary/openai", {
                method: "POST",
                body: JSON.stringify({
                    originalUrl: url,
                    originalContent: content,
                }),
            });
            setSummary(text ?? "");

            if (onSummarized) onSummarized();

            await refreshBalance();
        } catch (err) {
            console.error("요약 실패:", err);
            setSummary("요약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
    };
    return (
        <div className="summary-container">
            <h1 className="summary-title">뉴스 요약기</h1>
            <br />
            <div className="summary-group">
                <label className="summary-label">URL</label>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                    setUrl(e.target.value);
                    setContent('');
                    }}
                    style={{ width: '100%', marginBottom: 10}}
                />
            </div>

            <div className="summary-group">
                <label className="summary-label">기사 본문</label>
                <textarea
                    rows="6"
                    value={content}
                    onChange={(e) => {
                    setContent(e.target.value);
                    setUrl('');
                    }}
                    style={{ width: '100%', marginBottom: 10}}
                />
            </div>

            <button className="summary-button" onClick={handleSubmit}>
                Go
            </button>

            {summary && (
            <div className="summary-result">
                <h3>요약 결과:</h3>
                <p>{summary}</p>
            </div>
            )}
        </div>
        
    )
}

export default SummaryForm;