import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import { useParams } from "react-router-dom";

function AdminUserPageDetail() {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    
    const [summaries, setSummaries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchSummaries = useCallback(async (page) => {
        try {
            const data = await apiFetch(`/api/admin/users/${userId}/summaries?page=${page}&size=10`, {
                method: "GET"
            });
            setSummaries(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(data.number);
        } catch (e) {
            console.error("요약 이력 로드 실패:", e);
        }
    },[userId]);

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
            fetchSummaries(0);
        }
    }, [userId, fetchSummaries]);

    if (isLoading) return <div>데이터를 불러오는 중...</div>
    if (error) return <div style={{ color: "red" }}>{error}</div>
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
                        <td>{new Date(userData.createdAt).toLocaleDateString()}</td>
                        <td>{userData.lastActivityAt ? new Date(userData.lastActivityAt).toLocaleString() : "기록 없음"}</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginTop: '40px' }}>
                <h3>요약 요청 이력</h3>
                <table className="coin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>뉴스 제목</th>
                            <th>요약 일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaries.length > 0 ? (
                            summaries.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td style={{ textAlign: 'left'}}>{item.title}</td>
                                    <td>{new Date(item.savedAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ): (
                            <tr>
                                <td colSpan="3">요약 기록이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
                    <button
                        onClick={() => fetchSummaries(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        이전
                    </button>
                    <span>{currentPage + 1 }/{totalPages}</span>
                    <button
                        onClick={() => fetchSummaries(currentPage + 1)} 
                        disabled={currentPage + 1 >= totalPages}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminUserPageDetail;