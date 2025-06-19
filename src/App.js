import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import SummaryForm from "./components/SummaryForm";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div style={{display:"flex"}}>
        <Sidebar />
        <div style={{marginLeft: 220, padding: 40, flex: 1}}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signup" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/summary" element={<SummaryForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
