import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Cookies from 'js-cookie';
import '../../styles/App.css'
import { FiLogOut } from "react-icons/fi";

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
        

    <button className="logout-button" onClick={handleLogout}>
        <FiLogOut size={25} />
        
      </button>
    );


};

export default Logout;
