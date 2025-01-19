import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/components.css';
import '../../styles/App.css';

const Register = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Employee', 
        managerId: '', 
    });
    const [managers, setManagers] = useState([]); 
    const [error, setError] = useState('');

    useEffect(() => {
        if (formData.role === 'Employee') {
            
            const fetchManagers = async () => {
                try {
                    const response = await api.get('/team/users?role=Manager');
                    setManagers(response.data); 
                } catch (error) {
                    console.error('Failed to fetch managers:', error);
                    setManagers([]); 
                }
            };
            fetchManagers();
        } else {
            
            setManagers([]); 
        }
    }, [formData.role]); 
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/auth/register', formData);
            console.log('User registered successfully:',response.data);
            
            navigate('/admin');
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error);
            setError(error.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className='register-body'>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                
                <div className='role-dropdown'>
                    <label>Role:</label>
                    
                    <div>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        
                    </select>
                    </div>
                   
                    
                    
                </div>

                {formData.role === 'Employee' && (
    <div className='role-dropdown'>
        <label>Manager:</label>

        <div>
        <select
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            required
        >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
                <option key={manager._id} value={manager._id}>
                    {manager.name} 
                </option>
            ))}
        </select>
        </div>
        
    </div>
)}

 <div className='register-btns'>
 <button className="btn btn-secondary" type="submit">Register</button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin')}
                >
                    Cancel
                </button>
 </div>
                
            </form>
            

            
        </div>
    );
};

export default Register;

