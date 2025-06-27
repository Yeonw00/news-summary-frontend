import { useState } from "react";
import "../.css";

function SummaryForm() {
      const [url, setUrl] = useState('');
      const [content, setContent] = useState('');
      const [summary, setSummary] = useState('');

      const handleSubmit = async () => {
        setSummary('');

        const response = await fetch('http://localhost:8080/api/summary/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify({
                    originalUrl: url,
                    originalContent: content
                }),
        });
    
        const text = await response.text();
        setSummary(text);
      };
    return (
        <div className="summary-container">
            <h1 className="summary-title">뉴스 요약기</h1>
            <div className="summary-group">
                <label className="summary-label">URL:</label>
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
                <label className="summary-label">기사 본문:</label>
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

            <button onClick={handleSubmit} className="summary-button" >
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