import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Cookies from 'js-cookie'; 
import '../../styles/components.css';
import '../../styles/App.css';

const Login = () => {
    const { login } = useContext(AuthContext); 
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();  

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', credentials);
            console.log("Data",data)
            
            const AccessToken = Cookies.get('accessToken');
            console.log('Atoken',AccessToken)
    
            
            login(data.accessToken, { ...data.user, token: data.accessToken });
    
            
            if (data.user.role === 'Admin') {
                navigate('/admin');
            } else if (data.user.role === 'Manager'){
                navigate('/manager');
            }else{
                navigate('/employee');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
    
    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <button type="submit">Login</button>
            </form>

            
        </div>
    );
};

export default Login;
