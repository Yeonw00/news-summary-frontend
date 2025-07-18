import { useState } from "react";

function EditProfileForm() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            email,
            newPassword,
            currentPassword
        };

        try {
            const res = await fetch("http://localhost:8080/api/user/me", {
                method:"PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            if(!res.ok) throw new Error("회원정보 수정 실패");

            setMessage("회원정보가 수정되었습니다.");
            setNewPassword("");
            setCurrentPassword("");
        } catch (err) {
            setMessage("수정 실패: " + err.message);
        }
    };

    return (
        <div className="form-container">
            <h2>회원정보 수정</h2>
            <form className="form-title" onSubmit={handleSubmit}>
                <label>이메일</label>
                <input 
                    type="email"
                    placeholder="새 이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />

                <label>현재 비밀번호</label>
                <input 
                    type="password"
                    placeholder="현재 비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <br />

                <label>새 비밀번호</label>
                <input 
                    type="password"
                    placeholder="변경할 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <br />

                

                <button type="submit" className="form-button">수정하기</button>
            </form>

            {message && <p style={{marginTop: "1rem", color: "#444"}}>{message}</p>}
        </div>
    );
}

export default EditProfileForm