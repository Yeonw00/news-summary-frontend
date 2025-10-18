import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";

function SummaryDetail() {
    const { requestId } = useParams();
    const [detail, setDetail] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetail = async () => {
            try {
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
        return(
            <div style={{ color: "#b30000", padding: "1rem"}}>
                <p>{error}</p>
            </div>
        );
    }

    if (!detail) return <div>로딩 중...</div>;

    return (
        <div style={{ padding: "1rem" }}>
            <h2>요약 상세</h2>
            <hr />
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6}}>
                {detail.summary}
            </p>
        </div>
    );
}

export default SummaryDetail;