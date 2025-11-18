import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [balance, setBalance] = useState(0);

    const doLogoutSilent = useCallback(() => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setBalance(0);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }, []);

    const refreshBalance = useCallback(async () => {
        try {
            const data = await apiFetch("/api/wallet/me", { method: "GET" });
            setBalance(data.balance ?? 0);
        } catch (e) {
            console.error("잔액 조회 실패:", e);
        }
    }, []);

    const checkLogin = useCallback(async () => {
        setIsChecking(true);
        try {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                setCurrentUser(parsed);
                setIsLoggedIn(true);
            }

            const data = await apiFetch("/api/auth/check", { method: "GET" });
            if (data?.loggedIn) {
                if (data.user) {
                    setCurrentUser(data.user);
                    setIsLoggedIn(true);
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
                await refreshBalance();
            } else {
                doLogoutSilent();
            }
        } catch (e) {
            console.error("checkLogin 실패:", e);
            doLogoutSilent();
        } finally {
            setIsChecking(false);
        }
    }, [doLogoutSilent, refreshBalance]);

    const login = useCallback((userObj, token) => {
        if (token) localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObj));
        setCurrentUser(userObj);
        setIsLoggedIn(true);
    }, []);

    const logout = useCallback (async () => {
        try {
            await apiFetch("/api/auth/logout", { 
                method: "POST"
            })
            .catch(() => {});
        } finally {
            doLogoutSilent();
        }
    }, [doLogoutSilent]);

    useEffect(() => {
        checkLogin();
    }, [checkLogin]);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "user" || e.key === "token") {
                checkLogin();
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [checkLogin]);
    
    const value = useMemo(
        () => ({ 
            isLoggedIn, 
            setIsLoggedIn, 
            currentUser, 
            setCurrentUser, 
            isChecking, 
            login,
            logout,
            balance,
            refreshBalance, 
            refresh: checkLogin
        }),
        [isLoggedIn, currentUser, isChecking, login, logout, checkLogin, balance, refreshBalance]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);