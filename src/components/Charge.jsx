import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { loadTossWidget } from "../lib/tossWidget";
import { GiTwoCoins } from "react-icons/gi";

const PRODUCTS = [
    {code: "COIN_1000", label: "1,000코인", price: 9900},
    {code: "COIN_3000", label: "3,000코인", price: 27000},
];

function Charge() {
    const [widget, setWidget] = useState(null);
    const [ready, setReady] = useState(false);
    const [balance, setBalance] = useState(null);
    const [busyCode, setBusyCode] = useState(null);
    const [error, setError] = useState("");
    const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;

    useEffect(() => {
        let mounted = true;

        (async () => {
            try{
                if(!clientKey) {
                    setError("결제 키가 설정되지 않았습니다. (REACT_APP_TOSS_CLIENT_KEY)");
                    return;
                }
                const PW = await loadTossWidget();
                const instance = PW(clientKey, PW.ANONYMOUS);
                if(mounted) {
                    setWidget(instance);
                    setReady(true);
                }
            } catch(e) {
                console.error(e);
                setError("결제 위젯 로딩에 실패했습니다.");
            }
        })();

        return () => {
            mounted = false;
        };
    }, [clientKey]);

    async function handlePay(p) {
        if(!ready || !widget) return;
        setError("");
        setBusyCode(p.code);
        try {
            // 1) 서버에서 주문 생성 (orderId, amount 확보)
            const order = await apiFetch("/api/payments/orders", {
                method: "POST",
                body: JSON.stringify({ productCode: p.code}),
            });
            if (!order.orderId || !order?.amount) {
                throw new Error("주문 생성에 실패했습니다.");
            }

            // 2) Toss 결제창 호출 (성공/실패 페이지는 라우팅에 맞게)
            await widget.requestPayment({
                orderId: order.orderId,
                orderName: p.code,
                amount: order.amount,
                successUrl: `${window.location.origin}/charge/success?orderId=${encodeURIComponent(
                    order.orderId
                )}&amount=${order.amount}`,
                failUrl: `${window.location.origin}/charge/fail`,
            });
            // 성공 시 successUrl로 이동되므로 아래 코드는 보통 실행되지 않음
        } catch(e) {
            console.error(e);
            setError(e?.message || "결제 요청에 실패했습니다.");
        } finally {
            setBusyCode(null);
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
            
            <div style={{ display: "grid", gap: 10 }}>
                {PRODUCTS.map(p => (
                    <button 
                        key={p.code} 
                        onClick={() => handlePay(p)}
                        disabled={!ready || !!busyCode}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 14px",
                            borderRadius: 12,
                            border: "1px solid #ddd",
                            background: busyCode === p.code ? "#f3f3f3" : "white",
                            cursor: !ready || !!busyCode ? "not-allowed" : "pointer",
                            fontSize: 16,
                        }}
                    >
                        <span>{p.label}</span>
                        <strong>{p.price.toLocaleString()}원</strong>
                    </button>
                ))}
            </div>

            <p style={{ color: "#666", fontSize: 12, marginTop: 12 }}>
                ※ 테스트 모드에서는 토스 테스트 카드번호로 결제하세요. 운영 전환 시 콘솔 도메인/리다이렉트/키를 점검하세요.
            </p>
        </div>
    );
}

export default Charge;