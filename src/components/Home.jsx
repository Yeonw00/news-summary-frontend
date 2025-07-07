import { useNavigate } from "react-router-dom";
import "../.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home">
            <h1>News Summary</h1>
            <h3>Welcome!</h3>
            <br/>
            <div className="button-group">
                <button className="home-button" onClick={() => navigate("/login")}>Login</button>
                <button className="home-button" onClick={() => navigate("/signup")}>Signup</button>
            </div>
        </div>
    );
}

export default Home;