import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Cookies from 'js-cookie';

const Logout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            
            await api.post('/auth/logout');
            
            
            logout();
            Cookies.remove('accessToken');
            
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button style={{    "width": "auto", "right": "-210px"}} onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
