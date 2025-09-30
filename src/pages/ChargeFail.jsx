import { useNavigate, useSearchParams } from "react-router-dom";

function ChargeFail() {
    const [search] = useSearchParams();
    const navigate = useNavigate();
    const code = search.get("code");
    const message = search.get("message");

    return(
        <div style={{ maxWidth: 520, margin: "60px auto", padding: 20 }}>
            <h2>결제 실패</h2>
            <p>사유 코드: {code}</p>
            <p>메시지: {message}</p>
            <button onClick={() => navigate("/wallet/charge")} style={{ marginTop: 16}}>
                다시 시도하기
            </button>
        </div>
    ) 
}

export default ChargeFail;