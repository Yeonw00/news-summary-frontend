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
            <br />
            <div className="summary-group" style={{ marginBottom: 12 }}>
                <label style={{ marginRight: 16 }}>
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

                <label>
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
            <div className="summary-group">
                <label className="summary-label">URL</label>
                <input
                    type="text"
                    value={url}
                    disabled={mode !== "URL" || loading}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{ width: '100%', marginBottom: 10}}
                />
            </div>

            <div className="summary-group">
                <label className="summary-label">기사 본문</label>
                <textarea
                    rows="6"
                    value={content}
                    disabled={mode !== "CONTENT" || loading}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ width: '100%', marginBottom: 10}}
                />
            </div>

            <button className="summary-button" onClick={handleSubmit} disabled={loading || !mode}>
                {loading ? "Loading..." : "Go"}
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