import { useEffect, useMemo, useState } from "react";
import { Link } from 'react-router-dom';
import { apiFetch } from "../../api/client";

const PAGE_SIZE = 20;

function buildQuery(params) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v ==="") return;
        sp.set(k, String(v));
    });
    return sp.toString();
}

function AdminUsersPage() {
    const [rows, setRows] = useState([]);
    
    const [page, setPage] = useState(0);
    const [size] = useState(PAGE_SIZE);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    
    const [keywordInput, setKeywordInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const [role, setRole] = useState("");
    const [social, setSocial] = useState("");
    
    const[loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const t = setTimeout(() => {
            setKeyword(keywordInput.trim());
            setPage(0);
        }, 400);
        return () => clearTimeout(t);
    }, [keywordInput]);

    useEffect(() => {
        setPage(0);
    }, [role, social]);

    const queryString = useMemo(() => {
        return buildQuery({
            page,
            size,
            keyword: keyword || undefined,
            role: role || undefined,
            social: social === "" ? undefined : social,
        });
    }, [page, size, keyword, role, social]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError("");
            try {
                const data = await apiFetch(`/api/admin/users?${queryString}`, {method: "GET"});
                if (cancelled) return ;

                const list = Array.isArray(data) ? data : (data.content ?? []);
                setRows(list);

                setTotalElements(data.totalElements ?? list.length ?? 0);
                setTotalPages(data.totalPages ?? 1);
                setHasNext(Boolean(data.hasNext));
            } catch (e) {
                if (cancelled) return;
                setError(e.message || "불러오기 실패");
                setRows([]);
                setTotalElements(0);
                setTotalPages(0);
                setHasNext(false);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [queryString]);

    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>사용자 관리</h2>
            <br />
                
            <div className="admin-filterbar">
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">권한 전체</option>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>

                <select value={social} onChange={(e) => setSocial(e.target.value)}>
                    <option value="">로그인 전체</option>
                    <option value="true">소셜</option>
                    <option value="false">일반</option>
                </select>

                <input 
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="이메일/닉네임 검색"
                />

                <button className="admin-filterbar__reset"
                    onClick={() => {
                        setKeywordInput("");
                        setRole("");
                        setSocial("");
                        setPage(0);
                    }}
                >
                    초기화
                </button>

                <div className="admin-filterbar__count">
                    총 <b>{totalElements}</b>명
                </div>
            </div>

            {loading && <div>불러오는 중...</div>}

            <table className="coin-table" style={{ width: "100%", borderCollapse: "collapse"}}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Social</th>
                        <th>Coins</th>
                        <th>CreatedAt</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.email}</td>
                            <td>
                                <Link to={`/admin/users/${user.userId}`} className="user-link">
                                    {u.userName ?? u.username}
                                </Link>
                            </td>
                            <td>{u.role}</td>
                            <td>{u.socialLogin ? "Y" : "N"}</td>
                            <td style={{ textAlign: "right" }}>{u.coinBalance}</td>
                            <td>{u.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
                <button onClick={() => setPage((p) => Math.max(0, p -1))} disabled={page === 0}>
                    이전
                </button>
                <span>
                    {page + 1} / {Math.max(totalPages, 1)}
                </span>
                <button onClick={() => hasNext && setPage((p) => p + 1)} disabled={!hasNext}>
                    다음
                </button>
            </div>
        </div>
    );
}

export default AdminUsersPage;