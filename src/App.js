import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import SummaryForm from "./components/SummaryForm";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";


function Layout() {
  const { isLoggedIn } = useAuth();

  return(
    <div className="app-container">
      {isLoggedIn && <Sidebar />}
      <div className="main-content">
        <Routes>
          <Route
          path="/" element={
            isLoggedIn ? <SummaryForm /> : <Main /> } 
          />
          <Route path="/signup" element={<RegisterForm />}/>
          <Route path="/login" element={<LoginForm />}/>
          <Route 
            path="/summary" element={
              isLoggedIn ? <SummaryForm /> : <Main /> }
          />
        </Routes>
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


