import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
        <div style={{ maxWidth: 800, margin: 'auto', padding: 20}}>
            <h1>뉴스 요약기</h1>
            <div>
                <label>URL:</label>
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

            <div>
                <label>기사 본문:</label>
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

            <button onClick={handleSubmit} >
                Go
            </button>

            {summary && (
            <div style={{ marginTop: 20 }}>
                <h3>요약 결과:</h3>
                <p>{summary}</p>
            </div>
            )}
        </div>
        
    )
}

export default SummaryForm;