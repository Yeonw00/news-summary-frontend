import { useNavigate } from "react-router-dom";
import "../.css";

function Main() {
    const navigate = useNavigate();

    return (
        <div className="main">
            <h1>News Summary</h1>
            <h3>Welcome!</h3>
            <div className="button-group">
                <button className="main-button" onClick={() => navigate("/login")}>Login</button>
                <button className="main-button" onClick={() => navigate("/signup")}>Signup</button>
            </div>
        </div>
    );
}

export default Main;