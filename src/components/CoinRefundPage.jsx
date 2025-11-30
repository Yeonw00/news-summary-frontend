import { useEffect, useState } from "react";

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
    const [refundAmount, setRefundAmount] = useState("");
    const [reason, setReason] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountHolder, setAccountHolder] = useState("");
    const [refunds, setRefunds] = useState([]);

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

    const handleFillAll = () => {
        if (balance != null) {
            setRefundAmount(String(balance));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefualt();
        setError("");
        setSuccessMessage("");

        if (balance == null) {
            setError("잔액 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        const parsedAmount = Number(refundAmount);
        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("환불할 코인 수를 0보다 크게 입력해주세요.");
            return;
        }

        if (parsedAmount > balance) {
            setError("환불 금액이 보유 코인보다 많습니다.");
            return;
        }

        if (!reason.trim()) {
            setError("환불 사유를 입력해주세요.");
            return;
        }

        if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
            setError("환불 계좌 정보를 모두 입력해주세요.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                amount: parsedAmount,
                reason: reason.trim(),
                bankName: bankName.trim(),
                accountNumber: accountNumber.trim(),
                accountHolder: accountHolder.trim(),
            };

            await apiFetch(`/api/wallet/refund/${orderUid}`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setSuccessMessage("환불 신청이 접수되었습니다.");
            setRefundAmount("");
            setReason("");
            setBankName("");
            setAccountNumber("");
            setAccountHolder("");

            await loadData();
        } catch (e) {
            console.error(e);
            setError("환불 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormDisabled = isLoading || isSubmitting || !balance || balance <= 0;

    return (
        <div className="coin-refund-page" style={StyleSheet.page}>
             <div style={StyleSheet.header}>
                <h1 style={StyleSheet.title}>코인 환불 신청</h1>
                <p style={StyleSheet.subtitle}>
                    남은 코인을 계좌로 환불 신청할 수 있습니다.
                    <br />
                    환불 처리에는 영업일 기준 일정 시간이 소요될 수 있습니다.
                </p>
             </div>

             <div style={StyleSheet.layout}>
                <div style={StyleSheet.leftColumn}>
                    <section style={StyleSheet.card}>
                        <h2 style={StyleSheet.cardTitle}>보유 코인</h2>
                        <p style={StyleSheet.balanceText}>
                            현재 잔액{" "}
                            <strong>{balance == null ? "-" : `${formatNumber(balance)} 코인`}</strong>
                        </p>
                        {balance === 0 && (
                            <p style={StyleSheet.helperText}>
                                환불 가능한 코인이 없습니다. 코인 충전 후 이용해주세요.
                            </p>
                        )}
                    </section>

                    <section style={StyleSheet.card}>
                        <h2 style={StyleSheet.cardTitle}>환불 정보 입력</h2>

                        <form onSubmit={handleSubmit} style={StyleSheet.form}>
                            <label style={StyleSheet.label}>
                                환불할 코인 수
                                <div style={StyleSheet.amountRow}>
                                    <input 
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                        placeholder="예: 1000"
                                        style={StyleSheet.input}
                                        disabled={isFormDisabled}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleFillAll}
                                        style={StyleSheet.smallButton}
                                        disabled={isFormDisabled || balance == null || balance <= 0}
                                    >
                                        전체
                                    </button>
                                </div>
                                <span style={StyleSheet.helperText}>
                                    보유 코인: {balance == null ? "-" : `${formatNumber(balance)} 코인`}
                                </span>
                            </label>

                            <label style={StyleSheet.labe}> 
                                환불 사유
                                <textarea 
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="예: 서비스 사용 중단으로 인한 잔여 코인 환불 요청"
                                    rows={3}
                                    style={StyleSheet.textarea}
                                    disabled={isFormDisabled}
                                />
                            </label>

                            <div style={StyleSheet.fieldGroup}>
                                <label style={StyleSheet.label}>
                                    은행명
                                    <input 
                                        type="text"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        placeholder="예: 국민은행"
                                        style={StyleSheet.input}
                                        disabled={isFormDisabled}
                                    />
                                </label>
                                <label style={StyleSheet.label}>
                                    예금주
                                    <input 
                                        type="text"
                                        value={accountHolder}
                                        onChange={(e) => setAccountHolder(e.target.value)}
                                        placeholder="예: 홍길동"
                                        style={StyleSheet.input}
                                        disabled={isFormDisabled}
                                    />
                                </label>
                            </div>
                            
                            <label style={StyleSheet.label}>
                                계좌번호
                                <input 
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="예 123456-01-234567"
                                    style={StyleSheet.input}
                                    disabled={isFormDisabled}
                                />
                            </label>

                            <p style={StyleSheet.noticeText}>
                                . 결제 수단에 따라 실제 입금까지 시간이 걸릴 수 있습니다.
                                <br />
                                . 부정 이용이 의심되는 경우 환불이 제한될 수 있습니다.
                            </p>

                            {error && <p style={StyleSheet.errorText}>{error}</p>}
                            {successMessage && <p style={StyleSheet.successText}>{successMessage}</p>}

                            <button
                                type="submit"
                                style= {{
                                    ...StyleSheet.submitButton,
                                    ...(isFormDisabled ? StyleSheet.submitButtonDisabled : {}),
                                }}
                                disabled={isFormDisabled}
                            >
                                {isSubmitting ? "환불 신청 중..." : "환불 신청하기"}
                            </button>
                        </form>
                    </section>
                </div>

                
             </div>
        </div>
    );
}

export default CoinRefundPage;