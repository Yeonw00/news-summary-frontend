import { useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome!</h1>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Signup</button>
        </div>
    );
}

export default Main;