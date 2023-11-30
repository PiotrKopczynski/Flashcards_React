import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// This is a context that keeps track of if the user is logged in or not and is passed down to all components
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // To make the auth variable survive page refreshes, it is also stored in the localstorage.
    const storedAuth = localStorage.getItem("auth");
    const initialAuth = storedAuth ? JSON.parse(storedAuth) : { isLoggedIn: false, userRole: null };

    const [auth, setAuth] = useState(initialAuth);

    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(auth));
    }, [auth]);

    const logout = () => {
        setAuth({ isLoggedIn: false })
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;