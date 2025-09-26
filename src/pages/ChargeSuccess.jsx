import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/client";

function ChargeSuccess() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const paymentKey = params.get("paymentKey");
        const orderId = params.get("orderId");
        const amount = Number(params.get("amount"));
        apiFetch("/api/payments/confirm", {
            method: "POST",
            body: JSON.stringify({ paymentKey, orderId, amount }),
        })
        .then(() => navigate("/charge/done"), { replace: true})
        .catch(() => navigate("/charge/fail", {replace: true}));
    }, [params, navigate]);

    return <h2>승인 처리 중...</h2>
}
export default ChargeSuccess;