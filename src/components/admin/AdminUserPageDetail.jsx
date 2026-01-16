import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import { useParams } from "react-router-dom";

function AdminUserPageDetail() {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
       const fetchUserData = async () => {
            try {
                setIsLoading(true);
                setError("");
                const data = await apiFetch(`/api/admin/users/${userId}`, {method: "GET"});
                setUserData(data);
            } catch (e) {
                setError(e.message || "사용자 정보를 불러오는데 실패했습닏나.");
            } finally {
                setIsLoading(false);
            }
        };
        
        if (userId) {
            fetchUserData();
        }
    }), [userId];

    if (isLoading) return <div>데이터를 불러오는 중...</div>
    if (error) return <div style={{ color: "red" }}></div>
    if (!userData) return <div>사용자 정보가 없습니다.</div>

    return (
        <div>
            <h2>사용자 상세 정보</h2>
            <br />
            
            <table className="coin-table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Username</th>
                        <th>보유 코인</th>
                        <th>총 요약수</th>
                        <th>성공수</th>
                        <th>총 소모 코인</th>
                        <th>가입일</th>
                        <th>최근 활동</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{userData.email}</td>
                        <td>{userData.username}</td>
                        <td>{userData.coinBalance?.toLocaleString()}개</td>
                        <td>{userData.totalSummaryCount}회</td>
                        <td>{userData.successCount}회</td>
                        <td>{userData.totalSpentBalance?.toLocaleString()}개</td>
                        <td>{new Date(userData.createdAt).toLocaleDateString}</td>
                        <td>{userData.lastActivityAt ? new Date(userData.lastActivityAt).toLocaleString() : "기록 없음"}</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginTop: '40px' }}>
                <h3>요약 요청 이력</h3>
            </div>
        </div>
    );
}

export default AdminUserPageDetail;