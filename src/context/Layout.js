import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import SummaryForm from "../components/SummaryForm";
import Home from "../components/Home";
import Sidebar from "../components/Sidebar";
import SummaryDetail from "../components/SummaryDetail";
import Header from "../components/Header";
import ProtectedRoute from "./ProtectedRoute";
import EditProfileForm from "../components/EditProfileForm";
import NotFound from "../components/NotFound";
import ArticleSearch from "../components/ArticleSearch";
import GoogleSuccess from "../components/GoogleSuccess";
import NaverSuccess from "../components/NaverSuccess";
import KakaoSuccess from "../components/KakaoSuccess";
import PaymentForm from "../components/Payment";


function Layout() {
  const { isLoggedIn, isChecking } = useAuth();
  const [selectedView, setSelectedView] = useState("summary");
  const [summaries, setSummaries] = useState([]);

  const fetchSummaryList = useCallback(async () => {
    const token = localStorage.getItem("token");
    if(!token) return;
    
    const res = await fetch("http://localhost:8080/api/summary/list", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    if(res.ok) {
      const data = await res.json();
      setSummaries(data);
    }
  }, []);
  
  useEffect(() => {
    if(isLoggedIn) {
      fetchSummaryList();
    }
  }, [isLoggedIn, fetchSummaryList]);
  
  if (isChecking) return null;

  return(
    <div className="page-wrapper">
      <div className="app-container">
        {isLoggedIn && (
          <Sidebar summaries={summaries} fetchSummaryList={fetchSummaryList} selectedView={selectedView} setSelectedView={setSelectedView} /> 
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
            <Route path="naver-success" element={<NaverSuccess />} />
            <Route path="kakao-success" element={<KakaoSuccess />} />
            <Route 
              path="/summary" 
              element={
                <ProtectedRoute>
                    <SummaryForm onSummarized={fetchSummaryList} />
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
            <Route 
              path="/payment"
              element= {
                <ProtectedRoute>
                  <PaymentForm />
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