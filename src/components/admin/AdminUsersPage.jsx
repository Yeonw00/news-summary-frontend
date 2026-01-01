import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";

function AdminUsersPage() {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const data = await apiFetch("/api/admin/users", {method: "GET"});
                setRows(data ?? []);
            } catch (e) {
                setError(e.message || "불러오기 실패");
            }
        })();
    }, []);

    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>사용자 관리</h2>

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
                            <td>{u.email}</td>
                            <td>{u.username}</td>
                            <td>{u.role}</td>
                            <td>{u.password ? "Y" : "N"}</td>
                            <td style={{ textAlign: "right" }}>{u.coinBalance}</td>
                            <td>{u.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminUsersPage;