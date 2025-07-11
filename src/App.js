import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./context/Layout";




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


