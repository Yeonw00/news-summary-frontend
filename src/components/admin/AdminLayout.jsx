import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminRoute from "./AdminRoute";
import AdminUsersPage from "./AdminUserSPage";
import AdminUserPageDetail from "./AdminUserPageDetail";

function AdminLayout() {
    return(
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: 24 }}>
                <h1>ADMIN LAYOUT</h1>
                <br />
                <Routes>
                    <Route
                        path="/"
                        element= {
                            <AdminRoute>
                                <AdminUsersPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/users/:userid"
                        element= {
                            <AdminRoute>
                                <AdminUserPageDetail />
                            </AdminRoute>
                        }
                    />
                </Routes>
                <Outlet />
            </main>    
        </div>
    );
}

export default AdminLayout;