import { useState } from "react";
import "../.css";
import { apiFetchText } from "../api/client";
import { useAuth } from "../context/AuthContext";

function SummaryForm({ onSummarized }) {
    const { refreshBalance } = useAuth();

    const [mode, setMode] = useState("URL");
    const [url, setUrl] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    

    const handleSubmit = async () => {
        if (!mode) {
            alert("URL 또는 본문 중 하나를 선택하세요.");
            return;
        }

        if (mode ==="URL" && !url.trim()) {
            alert("URL을 입력하세요.");
            return;
        }

        if (mode === "CONTENT" && !content.trim()) {
            alert("본문을 입력하세요.");
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            setSummary("");

            const requestId = crypto.randomUUID();

            const payload =
                mode === "URL"
                ? {originalUrl: url.trim()}
                : {originalContent: content.trim()};

            const text = await apiFetchText("/api/summary/openai", {
                method: "POST",
                headers: { "X-Request-Id": requestId },
                body: JSON.stringify(payload),
            });
            setSummary(text ?? "");
            setUrl("");
            setContent("");
            setMode("URL");

            if (onSummarized) onSummarized();

            await refreshBalance();
        } catch (err) {
            console.error("요약 실패:", err);
            setSummary("요약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="summary-container">
            <h1 className="summary-title">뉴스 요약기</h1>
            
            {/* 모드 선택 (Radio Group) */}
            <div className="summary-mode-group">
                <label className={`mode-label ${mode === "URL" ? "active" : ""}`}>
                    <input
                        type="radio"
                        name="mode"
                        value="URL"
                        checked={mode === "URL"}
                        disabled={loading}
                        onChange={() => {
                            setMode("URL");
                            setContent("");
                        }}
                    />
                    URL로 요약
                </label>

                <label className={`mode-label ${mode === "CONTENT" ? "active" : ""}`}>
                    <input
                        type="radio"
                        name="mode"
                        value="CONTENT"
                        checked={mode === "CONTENT"}
                        disabled={loading}
                        onChange={() => {
                            setMode("CONTENT");
                            setUrl("");
                        }}
                    />
                    본문 직접 입력
                </label>
            </div>

            {/* 입력 섹션 */}
            <div className="summary-input-section">
                <div className={`summary-group ${mode !== "URL" ? "disabled" : ""}`}>
                    <label className="summary-label">뉴스 URL</label>
                    <input
                        type="text"
                        className="summary-input"
                        placeholder="https://news.naver.com/..."
                        value={url}
                        disabled={mode !== "URL" || loading}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>

                <div className={`summary-group ${mode !== "CONTENT" ? "disabled" : ""}`}>
                    <label className="summary-label">기사 본문 직접 입력</label>
                    <textarea
                        className="summary-textarea"
                        rows="8"
                        placeholder="요약할 내용을 여기에 붙여넣으세요."
                        value={content}
                        disabled={mode !== "CONTENT" || loading}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </div>

            <button 
                className={`summary-button ${loading ? "loading" : ""}`} 
                onClick={handleSubmit} 
                disabled={loading || (mode === "URL" ? !url : !content)}
            >
                {loading ? <span className="spinner"></span> : "요약하기"}
            </button>

            {/* 결과 섹션 */}
            {summary && (
                <div className="summary-result-container">
                    <h3 className="result-title">AI 요약 결과</h3>
                    <div className="result-content">
                        <p>{summary}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SummaryForm;