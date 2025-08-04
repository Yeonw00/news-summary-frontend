import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleSuccess() {
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const username = params.get("username");

        if(token) {
            localStorage.setItem("user", JSON.stringify({
                user: username,
                token: token
            }))
            setIsLoggedIn(true);

            navigate("/summary");
        } else {
            navigate("/login");
        }
    }, [navigate]);
    
    return <div>로그인 처리 중입니다...</div>;
}
export default GoogleSuccess;