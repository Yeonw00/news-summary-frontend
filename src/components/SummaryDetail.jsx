import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SummaryDetail() {
    const { requestId } = useParams();
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/summary/detail/${requestId}`)
            .then((res) => res.json())
            .then(setDetail);
    }, [requestId]);

    if (!detail) return <div>로딩 중...</div>;

    return (
        <div>
            <h1>요약 상세</h1>
            <p>{detail.summary}</p>
        </div>
    );
}

export default SummaryDetail;