import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { GiTwoCoins } from "react-icons/gi";

const PRODUCTS = [
    {code: "COIN_1000", label: "1,000코인", price: 9900},
    {code: "COIN_3000", label: "3,000코인", price: 27000},
];

function Charge() {
    const [paymentWidget, setPaymentWidget] = useState(null);
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);
    const [order, setOrder] = useState(null);
    const [isRendering, setIsRendering] = useState(false);
    const [amount, setAmount] = useState(null); 
    
    const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;

    useEffect(() => {
        let mounted = true;

        (async () => {
            try{
                apiFetch("api/wallet/me")
                    .then((d => setBalance(d?.balance ?? 0)))
                    .catch(() => setBalance(0));

                if(!clientKey) {
                    setError("결제 키가 설정되지 않았습니다. (REACT_APP_TOSS_CLIENT_KEY)");
                    return;
                }
                const widget = await loadPaymentWidget(clientKey, ANONYMOUS);
                if(mounted) setPaymentWidget(widget);
            } catch (e) {
                console.error(e);
                setError("결제 위젯 로딩에 실패했습니다.");
            }
        })();

        return () => {
            mounted = false;
        };
    }, [clientKey]);

    async function selectProduct(p) {
        if(!paymentWidget) return;
        setError("");
        setSelected(p);
        setOrder(null);
        setIsRendering(true);

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

            // // 2) 위젯 컨테이너 비우기(재렌더링 대비)
            // if (methodsRef.current) methodsRef.current.innerHTML = "";
            // if (agreementRef.current) agreementRef.current.innerHTML = "";

            // 3) 금액 상태 셋업(CheckoutPage와 동일 구조)
            const baseAmount = { currency: "KRW", value: created.amount };
            setAmount(baseAmount);

            // 4) 최초 렌더 시 금액을 옵션을 넘겨서 렌더
            await paymentWidget.renderPaymentMethods("#payment-method", {
                variantKey: "DEFAULT",
                value: created.amount,
                currency: "KRW",
            });
            await paymentWidget.renderAgreement("#agreement", {
                variantKey: "AGREEMENT",
            });
            setOrder(created);
        } catch (e) {
            console.error(e);
            setError(e?.message || "결제 위젯 렌더링에 실패했습니다.");
        } finally {
            setIsRendering(false);
        }
    }

    // 결제 요청(수단 미지정: 사용자가 위젯 UI에서 선택한 수단으로 결제)
    async function requestPay() {
        if(!paymentWidget || !order || !selected) return;
        setError("");

        try {
            await paymentWidget.requestPayment({
                orderId: order.orderId,
                orderName: selected.code,
                amount: amount.value,
                successUrl: `${window.location.origin}/charge/success?orderId=${encodeURIComponent(
                    order.orderId
                )}&amount=${amount.value}`,
                failUrl: `${window.location.origin}/charge/fail`,
            });
            // 성공 시 successUrl로 이동
        } catch (e) {
            console.error(e);
            setError(e?.message || "결제 요청에 실패했습니다.");
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
                            disabled={!paymentWidget || isRendering}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 14px",
                                borderRadius: 12,
                                border: active ? "2px solid #222" : "1px solid #ddd",
                                background: active ? "#f7f7f7" : "white",
                                cursor: !paymentWidget || isRendering ? "not-allowed" : "pointer",
                                fontSize: 16,
                            }}
                        >
                        <span>{p.label}</span>
                        <strong>{p.price.toLocaleString()}원</strong>
                    </button>
                );
                })}
            </div>

            {/* 결제수단/약관 위젯 영역 */}
            <div 
                id="payment-method" 
                style= {{
                    minHeight: 120,
                    padding: 12,
                    border: "1px dashed #ccc",
                    borderRadius: 12,
                    marginBottom: 12,
                    background: "#fafafa",
                }}
            />
            <div 
                id="agreement" 
                style={{
                    minHeight: 80,
                    padding: 12,
                    border: "1px dashed #ccc",
                    borderRadius: 12,
                    marginBottom: 16,
                    background: "#fafafa",
                }}
            />

            <button
                onClick={requestPay}
                disabled={!order || !selected || isRendering || !amount}
                style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: (!order || !selected || isRendering) ? "#65c7f3" : "#3182f6",
                    color: "white",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: (!order || !selected || isRendering) ? "not-allowed" : "pointer",
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