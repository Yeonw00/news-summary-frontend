import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setCurrentUser(parsed.username);

            fetch("http://localhost:8080/api/auth/check", {
                credentials: "include",
            })
                .then((res) => {
                    if(!res.ok) throw new Error("로그인 상태 확인 실패");
                    return res.json();
                }) 
                .then((data) => {
                    if(data.loggedIn) {
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                        setCurrentUser(null);
                        localStorage.removeItem("user");
                    }
                })
                .catch(() => {
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                    localStorage.removeItem("user");
                })
                .finally(() => {
                    setIsChecking(false);
                });
        } else {
            setIsChecking(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser, isChecking}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);