import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { apiFetch } from "../api/client";
import { ChevronLeft, ExternalLink, Calendar } from "lucide-react";

function SummaryDetail() {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // 백엔드 API 경로가 /api/summary/detail/{id} 인지 확인 필요
                const data = await apiFetch(`/api/summary/detail/${requestId}`);
                setDetail(data);
            } catch (err) {
                console.error("요약 상세 불러오기 실패:", err);
                setError(err.message || "요약 상세를 불러오지 못했습니다.");
            }
        };

        if (requestId) {
            fetchDetail();
        }
    }, [requestId]);

    if (error) {
        return (
            <div className="detail-error">
                <p>{error}</p>
                <button onClick={() => navigate(-1)}>뒤로 가기</button>
            </div>
        );
    }

    if (!detail) return <div className="detail-loading">로딩 중...</div>;

    return (
        <div className="detail-container">
            {/* 상단 헤더 섹션 */}
            <header className="detail-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} /> 뒤로가기
                </button>
                <h2 className="detail-title">{detail.title || "요약 리포트"}</h2>
                <div className="detail-meta">
                    <span>
                        <Calendar size={14} /> {new Date(detail.createdAt).toLocaleDateString()}
                    </span>
                    {detail.originalUrl && (
                        <a href={detail.originalUrl} target="_blank" rel="noreferrer" className="source-link">
                            <ExternalLink size={14} /> 원문 보기
                        </a>
                    )}
                </div>
            </header>

            {/* 요약 본문 카드 */}
            <article className="detail-card">
                <div className="badge">AI Summary</div>
                <div className="summary-content">
                    {/* 백엔드 필드명이 summaryResult 인지 summary 인지 확인 필요 */}
                    {detail.summaryResult || detail.summary}
                </div>
            </article>

            {/* 원문 본문 (접이식) */}
            {detail.originalContent && (
                <section className="original-section">
                    <details>
                        <summary>기사 원문 전체보기</summary>
                        <p className="original-text">{detail.originalContent}</p>
                    </details>
                </section>
            )}
        </div>
    );
}

export default SummaryDetail;