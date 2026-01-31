import { useState } from "react";
import { apiFetch } from "../api/client"; 

function EditProfileForm() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleEmailChange = async () => {
        if (!email)  {
            alert("새 이메일을 입력해주세요.");
            return;
        }

        try {
            await apiFetch("/api/user/me", {
                method: "PATCH",
                body: JSON.stringify({ email }),
            })

            setMessage("회원정보가 수정되었습니다.");
            setEmail("");
        } catch (err) {
            console.error("회원정보 수정 실패:", err);
            setMessage("수정 실패: " + (err.message || "서버 오류"));
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword)  {
            alert("현재 및 새 비밀번호를 입력해주세요.");
            return;
        }

        try {
            await apiFetch("/api/user/me", {
                method:"PATCH",
                body: JSON.stringify({ 
                    currentPassword,
                    newPassword,
                 }),
            });

            setMessage("회원정보가 수정되었습니다.");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            console.error("비밀번호 변경 실패:", err);
            setMessage("수정 실패: " + (err.message || "서버 오류"));
        }
    };

    return (
        <div className="edit-container">
            <h2 className="edit-header">회원정보 수정</h2>
            <br />
            <div className="edit-group">
                <label>이메일</label>
                <div className="edit-row">
                    <input 
                        type="email"
                        placeholder="새 이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleEmailChange} className="form-button" >
                        변경
                    </button>
                </div>
            </div>

            <div className="edit-group">
                <label>비밀번호</label>
                <div className="edit-row">
                    <input 
                        type="password"
                        placeholder="현재 비밀번호"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    <div style={{ width: '50px' }}></div>
                </div>
            </div>

            <div className="edit-group"> 
                <div className="edit-row">
                    <input 
                        type="password"
                        placeholder="변경할 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={handlePasswordChange} className="form-button">
                        변경
                    </button>
                </div>
            </div>
            {message && <p style={{marginTop: "1rem", color: "#444"}}>{message}</p>}
        </div>
    );
}

export default EditProfileForm