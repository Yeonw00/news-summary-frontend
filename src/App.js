import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import SummaryForm from "./components/SummaryForm";
import Main from "./components/Main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="summary" element={<SummaryForm />} />
      </Routes>
    </Router>
  );
}

export default App;
