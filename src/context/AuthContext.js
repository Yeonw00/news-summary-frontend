import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/api/auth/me", {
            credentials: "include",
        })
            .then((res) => {
                if(res.ok) return res.text();
                throw new Error("Not authenticated");
            })
            .then((username) => setCurrentUser(username))
            .catch(() => setCurrentUser(null))
    }, []);

    const login = (username) => setCurrentUser(username);
    const logout = () => setCurrentUser(null);

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, login, logout, currentUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);