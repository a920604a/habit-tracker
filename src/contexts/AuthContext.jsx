import React, { useEffect, useState, createContext, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase'; 
import { useNavigate } from 'react-router-dom';

// 建立一個 Context 來保存使用者狀態
const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(null);
                navigate('/');  // 未登入時導向登入頁
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [navigate]);

    if (loading) {
        return <div>載入中...</div>;
    }

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
}
