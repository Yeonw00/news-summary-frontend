import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import SummaryForm from "../components/SummaryForm";
import Home from "../components/Home";
import Sidebar from "../components/Sidebar";
import SummaryDetail from "../components/SummaryDetail";
import Header from "../components/Header";
import ProtectedRoute from "./ProtectedRoute";
import EditProfileForm from "../components/EditProfileForm";
import NotFound from "../pages/NotFound";
import ArticleSearch from "../components/ArticleSearch";
import GoogleSuccess from "../pages/GoogleSuccess";
import NaverSuccess from "../pages/NaverSuccess";
import KakaoSuccess from "../pages/KakaoSuccess"
import Charge from "../components/Charge";
import ChargeSuccess from "../pages/ChargeSuccess";
import ChargeFail from "../pages/ChargeFail";
import CoinHistoryPage from "../components/CoinHistoryPage";


function Layout() {
  const { isLoggedIn, isChecking } = useAuth();
  const [selectedView, setSelectedView] = useState("summary");
  const [summaries, setSummaries] = useState([]);

  const fetchSummaryList = useCallback(async () => {
    try {
      const data = await apiFetch("/api/summary/list", {
        method: "GET",
      });
      setSummaries(data ?? []);
    } catch (err) {
      console.error("요약 리스트 불러오기 실패:", err.message);
      setSummaries([]);
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
            <Route path="/charge/success" element={<ChargeSuccess />} />
            <Route path="/charge/fail" element={<ChargeFail />} />
            <Route path="/coins/history" element={<CoinHistoryPage />} />
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
              path="/charge"
              element= {
                <ProtectedRoute>
                  <Charge/>
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