import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/signup",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            });

            if(response.ok) {
                setMessage("회원가입 성공!");
                setUsername("");
                setPassword("");
                setEmail("");
                setSuccess(true);
            } else {
                const data = await response.text();
                setMessage(`회원가입 실패: ${data}`);
            }
        } catch(error) {
            setMessage("서버 요청 실패");
        }
    };

    return (
        <div className="form-container">
            <h2>회원가입</h2>
            <form className="form-title" onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
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
                <button className="form-button" type="submit">회원가입</button>
                {success &&(
                    <div style={{ marginTop: 12}}>
                        <p>{message}</p>
                        <br />
                        <button className="form-button" onClick={() => navigate("/")}>
                            main 화면으로
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default RegisterForm;