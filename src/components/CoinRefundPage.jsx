import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

function formatNumber(value) {
    if (value == null) return "-";
    return value.toLocaleString("ko-KR");
}

function formatDate(value) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("ko-KR");
}

function CoinRefundPage() {
    const [balance, setBalance] = useState(null);
    const [orders, setOrders] = useState([]); // 환불 가능 결제건
    const [reason, setReason] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const wallet = await apiFetch("/api/wallet/me", { method: "GET" });
            setBalance(wallet?.balance ?? 0);
        } catch (e) {
            console.error(e);
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!selectedId) {
            setError("환불할 결제건을 선택해주세요.");
            return;
        }

        if (!reason.trim()) {
            setError("환불 사유를 입력해주세요.");
            return;
        }

        const selectedOrder = orders.find((o) => o.id === selectedId);
        if (!selectedOrder) {
            setError("선택한 결제건을 찾을 수 없습니다.");
            return;
        }

        const orderUid = selectedOrder.orderUid;

        setIsSubmitting(true);
        try {
            await apiFetch(`/api/wallet/refund/${orderUid}`, {
                method: "POST",
                body: JSON.stringify({ reason: reason.trim() }),
            });

            setSuccessMessage("환불 신청이 접수되었습니다.");
            setReason("");
            setSelectedId(null);
            await loadData();
        } catch (e) {
            console.error(e);
            setError("환불 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="refund-page">
             <div className="refund-header">
                <h1 className="refund-title">코인 환불 신청</h1>
                <p className="refund-subtitle">
                     Toss 결제 취소를 통해, <strong>코인이 전혀 사용되지 않은 결제건</strong>만 환불이 가능합니다.
                </p>
             </div>
            <section className="refund-card">
                <h2 className="refund-cardTitle">보유 코인</h2>
                <p className="refund-balanceText">
                    현재 잔액{" "}
                    <strong>
                        {balance == null ? "-" : `${formatNumber(balance)} 코인`}
                    </strong>
                </p>
            </section>

            <div className="refund-layout">
                <div className="refund-leftColumn">
                    <section className="refund-card">
                        <h2 className="refund-cardTitle">환불 가능한 결제 내역</h2>
                        {isLoading ? (
                            <p className="refund-helperText">불러오는 중...</p>    
                        ) : orders.length === 0? (
                            <p className="refund-helperText">
                                환불 가능한 코인이 없습니다.
                                <br />
                                이미 사용된 코인이 포함된 결제건은 환불이 불가합니다.
                            </p>
                        ) : (
                            <div className="refund-tableWrapper">
                                <table className="refund-table">
                                <thead>
                                    <tr>
                                        <th className="refund-th">선택</th>
                                        <th className="refund-th">결제일시</th>
                                        <th className="refund-th">상품명</th>
                                        <th className="refund-th">충전 코인</th>
                                        <th className="refund-th">결제 금액</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((o) => (
                                    <tr key={o.id}>
                                        <td className="refund-td">
                                            <input
                                                type="radio"
                                                name="order"
                                                checked={selectedId === o.id}
                                                onChange={() => setSelectedId(o.id)}
                                            />
                                        </td>
                                        <td className="refund-td">{formatDate(o.paidAt)}</td>
                                        <td className="refund-td">{o.productName ?? "-"}</td>
                                        <td className="refund-td">
                                        {o.chargedCoins != null
                                            ? `${formatNumber(o.chargedCoins)} 코인`
                                            : "-"}
                                        </td>
                                        <td className="refund-td">
                                        {o.paidAmount != null
                                            ? `${formatNumber(o.paidAmount)} 원`
                                            : "-"}
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>

                <div className="refund-rightColumn">
                    <section className="refund-card">
                        <h2 className="refund-cardTitle">환불 신청</h2>
                        <form onSubmit={handleSubmit} className="refund-form">
                            <label className="refund-label">
                                환불 사유
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="예: 더 이상 서비스를 사용하지 않아 잔여 코인 환불을 요청합니다."
                                    rows={4}
                                    className="refund-textarea"
                                    disabled={isSubmitting}
                                />
                            </label>

                            <p className="refund-noticeText">
                                · 선택한 결제건의 전체 금액이 Toss 결제 취소로 환불됩니다.
                                <br />
                                · 해당 결제건에서 코인이 한 번이라도 사용된 경우 환불이 불가능합니다.
                                <br />
                                · 환불 완료 시, 충전되었던 코인만큼 코인 잔액에서 차감됩니다.
                            </p>

                            {error && <p className="refund-errorText">{error}</p>}
                            {successMessage && (
                                <p className="refund-successText">{successMessage}</p>
                            )}

                            <button
                                type="submit"
                                className= {
                                    `refund-submitButton ${isSubmitting ? "refund-submitButtonDisabled": ""}`
                                }
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "환불 처리 중..." : "선택한 결제건 환불 신청"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

                

export default CoinRefundPage;