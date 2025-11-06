import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const TYPE_OPTIONS = [
  { value: "", label: "전체" },
  { value: "CHARGE", label: "충전" },
  { value: "SPEND", label: "사용" },
  { value: "REFUND", label: "환불" },
  { value: "SIGNUP_BONUS", label: "가입 보너스" },
];

function formatDelta(type, delta) {
  const prefix = delta > 0 ? "+" : "";
  return `${prefix}${delta.toLocaleString()} 코인`;
}

function CoinHistoryPage() {
    const [items, setItems] = useState([]);
    const [type, setType] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadData = async (pageToLoad = 0) => {
        setLoading(true);
        try {
            const params = new URLSearchparams();
            params.set("page", pageToLoad);
            params.set("size", size);
            if (type) params.set("type", type);
            if (from) params.set("from", from);
            if (to) params.set("to", to);

            const data = await apiFetch(`/api/wallet/ledger?` + params.toString(), {
                method: "GET",
            });

            setItems(data.content || []);
            setPage(data.page);
            setTotalPages(data.totalPages);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(0);
    }, []);

    const handleSearch = () => {
        loadData(0);
    };

    const handlePageChange =(newPage) => {
        if (newPage < 0 || newPage >= totalPages) return;
        loadData(newPage);
    };

    return (
        <div className="container">
            <h2>코인 사용 내역</h2>

            <div className="filters">
                <label>
                    유형:
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        {TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>  
                </label>
                <label>
                    시작일:
                    <input 
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                </label>
                <label>
                    종료일:
                    <input 
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                </label>
                <button onClick={handleSearch} disabled={loading}>
                        검색
                </button>
            </div>

            {loading ? (
                <p>불러오는 중...</p>
            ) : items.length === 0? (
                <p>코인 사용 내역이 없습니다.</p>
            ) : (
                <table className="coin-table">
                    <thead>
                        <tr>
                            <th>일시</th>
                            <th>유형</th>
                            <th>코인 변화</th>
                            <th>잔액</th>
                            <th>설명</th>
                            <th>주문번호</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((row) => (
                            <tr key={row.id}>
                                <td>{row.createdAt?.replace("T", " ")}</td>
                                <td>{row.type}</td>
                                <td>{formatDelta(row.type, row.delta)}</td>
                                <td>{row.balanceAfter.toLocaleString()}</td>
                                <td>{row.description}</td>
                                <td>{row.orderUid ?? "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(page -1)} disabled={page <= 0}>
                        이전
                    </button>
                    <span>{page + 1} / {totalPages}</span>
                    <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages -1}>
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

export default CoinHistoryPage;