import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = Cookies.get('accessToken'); 
        if (token) {
            
            setUser({ name: 'User Name' }); 
        }
        const userData = localStorage.getItem("userData")
        if(userData){
            setUser(JSON.parse(userData))
        }
    }, []);

    const login = (token, userData) => {
        Cookies.set('accessToken', token); 
        localStorage.setItem("userData",JSON.stringify(userData) )
        setUser(userData);
    };

    const logout = () => {
        Cookies.remove('accessToken'); 
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
