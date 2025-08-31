import { useNavigate } from "react-router-dom";
import "../.css";
import googleLogo from "../image/signin-assets/google_logo.png";
import naverLogo from "../image/signin-assets/naver_logo.png";
import kakaoLogo from "../image/signin-assets/kakao_logo.png";

function Home() {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/google/login");
            const loginUrl = await response.text();
            window.location.href = loginUrl;
        } catch (error) {
            console.error("구글 로그인 URL 요청 실패:", error);
        }
    };

    const handleNaverLogin = async () => {
        try {
            window.location.href = "http://localhost:8080/api/auth/naver/login";
        } catch (error) {
            console.error("네이버 로그인 URL 요청 실패:", error);
        }
    };

    const handleKakaoLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/kakao/login");
            const loginUrl = await response.text();
            window.location.href = loginUrl;
        } catch (error) {
            console.error("구글 로그인 URL 요청 실패:", error);
        }
    };

    return (
        <div className="home">
            <h1>News Summary</h1>
            <h3>Welcome!</h3>
            <br/>
            <div className="button-group">
                <button className="home-button" onClick={() => navigate("/login")}>Login</button>
                <button className="home-button" onClick={() => navigate("/signup")}>Signup</button>
            </div>
            <br />
            <br />
            <br />
            <button className="social-login-btn" onClick={handleGoogleLogin}>
                <img src={googleLogo} alt="Google Logo" />
            </button>
            <button className="social-login-btn" onClick={handleNaverLogin}>
                <img src={naverLogo} alt="Naver Logo" />
            </button>
            <button className="social-login-btn" onClick={handleKakaoLogin}>
                <img src={kakaoLogo} alt="Kakao Logo" />
            </button>
        </div>
    );
}

export default Home;