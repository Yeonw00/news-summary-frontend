import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
    return(
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: 24 }}>
                <h1>ADMIN LAYOUT</h1>
                <Outlet />
            </main>    
        </div>
    );
}

export default AdminLayout;