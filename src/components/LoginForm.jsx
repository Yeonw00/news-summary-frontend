import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import googleLogo from "../image/signin-assets/google_logo.png";

function LoginForm() {
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/login",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // session 기반에서만 credentials 필요, JWT에서는 필요X
                //credentials: "include",
                body: JSON.stringify({ username,password}),
            });

            if(response.ok) {
                const data = await response.json();

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({ username: data.username }))
                setIsLoggedIn(true);
                navigate("/summary");
            } else {
                const data = await response.json();
                setMessage(`로그인 실패: ${data.message}`);
            }
        } catch (error) {
            setMessage("서버 요청 실패");
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorize/google";
    }

    return (
        <div className="form-container">
            <h2>로그인</h2>
            <form className="form-title" onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="아이디"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button className="form-button" type="submit">로그인</button>
                <br />
                <button className="google-login-btn" onClick={handleGoogleLogin}>
                    <img src={googleLogo} alt="Google Logo" />
                </button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default LoginForm;