import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { GiTwoCoins } from "react-icons/gi";
import { loadTossPayments } from "@tosspayments/payment-sdk";

const PRODUCTS = [
    {code: "COIN_1000", label: "1,000코인", price: 9900},
    {code: "COIN_3000", label: "3,000코인", price: 27000},
];

function Charge() {
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);
    const [order, setOrder] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;

    useEffect(() => {
        apiFetch("/api/wallet/me")
            .then((d) => setBalance(d?.balance ?? 0))
            .catch(() => setBalance(0));
    }, []);

    async function selectProduct(p) {
        setError("");
        setSelected(p);
        setOrder(null);
        setIsProcessing(true);

        try {
            // 1) 서버 주문 생성(orderId, amount 반환)
            const created = await apiFetch("/api/payments/orders", {
                method: "POST",
                body: JSON.stringify({ productCode: p.code }),
            });
            if(!created?.orderId || !created?.amount) {
                throw new Error("주문 생성에 실패했습니다.");
            }
            setOrder(created);
        } catch (e) {
            console.error(e);
            setError(e?.message || "주문 생성 중 오류가 발생했습니다.");
        } finally {
            setIsProcessing(false);
        }
    }

    // 결제 요청(수단 미지정: 사용자가 위젯 UI에서 선택한 수단으로 결제)
    async function requestPay() {
        if(!order || !selected) return;
        setError("");

        try {
            const tossPayments = await loadTossPayments(clientKey);
            if (typeof tossPayments?.requestPayment !== "function") {
                throw new Error("SDK 로딩 실패: requestPayment가 없습니다. 패키지/버전을 확인하세요.");
            }

            await tossPayments.requestPayment("CARD",{
                amount: order.amount,
                orderId: order.orderId,
                orderName: selected.label,
                successUrl: `${window.location.origin}/charge/success`,
                failUrl: `${window.location.origin}/charge/fail`,
            });
            // 성공 시 successUrl로 이동
        } catch (e) {
            console.error(e);
            setError(e?.message || "결제 요청 중 오류가 발생했습니다.");
        }
    }

    return (
        <div style={{ maxWidth: 520, margin: "40px auto", padding: 20 }}>
            <h2 style={{ fontSize: 24, marginBottom: 16 }}>코인 충전</h2>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <GiTwoCoins size={28} style={{ color: "gold" }} />
                <div style={{ fontSize: 18 }}>
                    보유 코인&nbsp; <strong>{balance ?? "-"}</strong>
                </div>
            </div>

            {error && (
                <div
                    role="alert"
                    style={{
                        background: "#fff5f5",
                        border: "1px solid #ffd1d1",
                        color: "#b30000",
                        borderRadius: 10,
                        padding: "10px 12px",
                        marginBottom: 12,
                        fontSize: 14,
                    }}
                >
                    {error}
                </div>
            )}
            
            <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
                {PRODUCTS.map(p => {
                    const active = selected?.code === p.code;
                    return(
                        <button 
                            key={p.code} 
                            onClick={() => selectProduct(p)}
                            disabled={isProcessing}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 14px",
                                borderRadius: 12,
                                border: active ? "2px solid #222" : "1px solid #ddd",
                                background: active ? "#f7f7f7" : "white",
                                cursor: isProcessing ? "not-allowed" : "pointer",
                                fontSize: 16,
                            }}
                        >
                        <span>{p.label}</span>
                        <strong>{p.price.toLocaleString()}원</strong>
                    </button>
                );
                })}
            </div>

            <button
                onClick={requestPay}
                disabled={!order || isProcessing}
                style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: !order || isProcessing ? "#65c7f3" : "#3182f6",
                    color: "white",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: !order || isProcessing ? "not-allowed" : "pointer",
                }}
            >
                결제하기
            </button>

            <p style={{ color: "#666", fontSize: 12, marginTop: 12 }}>
                ※ 테스트 모드에서는 토스 테스트 카드번호로 결제하세요. 운영 전환 시 콘솔 도메인/리다이렉트/키를 점검하세요.
            </p>
        </div>
    );
}

export default Charge;