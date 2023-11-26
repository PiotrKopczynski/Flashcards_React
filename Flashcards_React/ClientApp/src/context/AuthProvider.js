import { createContext, useState, useEffect } from "react";

// This is a context that keeps track of if the user is logged in or not and is passed down to all components
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // To make the auth variable survive page refreshes, it is also stored in the localstorage.
    const storedAuth = localStorage.getItem("auth");
    const initialAuth = storedAuth ? JSON.parse(storedAuth) : { isLoggedIn: false, userRole: null  };

    const [auth, setAuth] = useState(initialAuth);

    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(auth));
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;