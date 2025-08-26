import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NaverSuccess() {
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const username = params.get("username");

        if(token && username) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", username);
            setIsLoggedIn(true);

            navigate("/summary", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    }, [navigate, setIsLoggedIn]);
    
    return <div>로그인 처리 중입니다...</div>;
}
export default NaverSuccess;