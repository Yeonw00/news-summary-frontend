import { Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import SummaryForm from "../components/SummaryForm";
import Home from "../components/Home";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import SummaryDetail from "../components/SummaryDetail";
import Header from "../components/Header";
import ProtectedRoute from "./ProtectedRoute";

function Layout() {
  const { isLoggedIn, isChecking } = useAuth();

  if (isChecking) return null;

  return(
    <div className="page-wrapper">
      <div className="app-container">
        {isLoggedIn && <Sidebar />}
        <div className="main-section">
          {isLoggedIn && <Header />}
          <Routes>
            <Route path="/" 
              element={
                isLoggedIn ? (
                  <Navigate to="/summary" />
                ) : (
                  <Home />
                )
              }
            />
            <Route path="/signup" element={<RegisterForm />}/>
            <Route path="/login" element={<LoginForm />}/>
            <Route 
              path="/summary" 
              element={
                <ProtectedRoute>
                    <SummaryForm />
                </ProtectedRoute>
              }
            />
            <Route 
                path="/summary/:requestId" 
                element={
                    <ProtectedRoute>
                        <SummaryDetail />
                    </ProtectedRoute>
                }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Layout;