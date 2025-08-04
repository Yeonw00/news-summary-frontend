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
import EditProfileForm from "../components/EditProfileForm";
import NotFound from "../components/NotFound";
import { useState } from "react";
import ArticleSearch from "../components/ArticleSearch";
import GoogleSuccess from "../components/GoogleSuccess";

function Layout() {
  const { isLoggedIn, isChecking } = useAuth();
  const [selectedView, setSelectedView] = useState("summary");

  if (isChecking) return null;

  return(
    <div className="page-wrapper">
      <div className="app-container">
        {isLoggedIn && (
          <Sidebar selectedView={selectedView} setSelectedView={setSelectedView} /> 
        )}
        <div className="main-section">
          {isLoggedIn && <Header />}
          {selectedView === "search" && <ArticleSearch selectedView={selectedView} setSelectedView={setSelectedView} />}
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
            <Route path="google-success" element={<GoogleSuccess />}/>
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
            <Route 
              path="/profile"
              element= {
                <ProtectedRoute>
                  <EditProfileForm />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Layout;