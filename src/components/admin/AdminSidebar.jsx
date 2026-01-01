import { NavLink } from "react-router-dom";

function AdminSidebar() {
    return (
        <aside style={{ width: 220, borderRight: "1px solid #eee", padding: 16}}>
            <h3 style={{ marginTop: 0 }}>Admin</h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <NavLink to="/admin/users">사용자 관리</NavLink>
                {/* 나중에 추가 */}
                {/* <NavLink to="/admin/summaries">요약 요청</NavLink> */}
                {/* <NavLink to="/admin/ledgers">결제/코인 로그</NavLink> */}
                {/* <NavLink to="/admin/stats">통계</NavLink> */}
            </nav>
        </aside>
    );
}

export default AdminSidebar;