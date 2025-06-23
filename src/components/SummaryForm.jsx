import {useState} from "react";

function SummaryForm() {
      const [url, setUrl] = useState('');
      const [content, setContent] = useState('');
      const [summary, setSummary] = useState('');
      const [loading, setLoading] = useState('');
    
      const handleSubmit = async () => {
        setLoading(true);
        setSummary('');

        const meResponse = await fetch("http://localhost:8080/api/auth/me", {
            method: "GET",
            credentials: "include", // 세션 쿠키 포함 필수
            });

            const meText = await meResponse.text();
            console.log(meText);

    
        const response = await fetch('http://localhost:8080/api/summary/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
                    originalUrl: url,
                    originalContent: content
                }),
        });
    
        const text = await response.text();
        setSummary(text);
        setLoading(false);
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

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? '요약 중...' : '요약 요청'}
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