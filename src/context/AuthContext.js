import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "user" || e.key === "token") {
                checkLogin();
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    useEffect(() => {
        checkLogin();
    }, []);

    async function checkLogin() {
        setIsChecking(true);
        try {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                try {
                    const parsed = JSON.parse(savedUser);
                    setCurrentUser(parsed);
                    setIsLoggedIn(true);
                } catch {
                    setCurrentUser(null);
                    setIsLoggedIn(false);
                    localStorage.removeItem("user");
                }
            }

            const data = await apiFetch("/api/auth/check", { method: "GET" });
            if (data?.loggedIn) {
                if (data.user) {
                    setCurrentUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
                setIsLoggedIn(true);
            } else {
                doLogoutSilent();
            }
        } catch (e) {
            doLogoutSilent();
        } finally {
            setIsChecking(false);
        }
    }

    function doLogoutSilent() {
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    const login = (userObj, token) => {
        if (token) localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObj));
        setCurrentUser(userObj);
        setIsLoggedIn(true);
    };

    const logout = () => {
        doLogoutSilent();
    }

    const value = useMemo(
        () => ({ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser, isChecking, login, logout, refresh: checkLogin}),
        [isLoggedIn, currentUser, isChecking]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);