import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import SummaryForm from "./components/SummaryForm";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SummaryDetail from "./components/SummaryDetail";
import Header from "./components/Header";


function Layout() {
  const { isLoggedIn } = useAuth();

  return(
    <div className="page-wrapper">
      {isLoggedIn && <Header />}
      <div className="app-container">
        {isLoggedIn && <Sidebar />}
        <div className="app-content">
          <Routes>
            <Route
            path="/" element={
              isLoggedIn ? <SummaryForm /> : <Home /> } 
            />
            <Route path="/signup" element={<RegisterForm />}/>
            <Route path="/login" element={<LoginForm />}/>
            <Route 
              path="/summary" element={
                isLoggedIn ? <SummaryForm /> : <Home /> }
            />
            <Route path="/summary/:requestId" element={<SummaryDetail />}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;


