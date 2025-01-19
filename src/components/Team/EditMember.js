import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/components.css';
import '../../styles/App.css';

const EditMember = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        managerId: '',
    });
    const [managers, setManagers] = useState([]); 
    const [error, setError] = useState(null);

    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/team/users/${id}`, {
                    
                });
                setFormData(response.data);
            } catch (error) {
                setError('Failed to fetch user details.');
                console.error(error);
            }
        };

        const fetchManagers = async () => {
            try {
                const response = await api.get('/team/users?role=Manager', {
                    
                });
                setManagers(response.data); 
            } catch (error) {
                console.error('Failed to fetch managers:', error);
            }
        };

        fetchUser();
        fetchManagers();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'role' && value === 'Manager') {
            setFormData({ ...formData, role: value, managerId: '' }); 
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/auth/update/${id}`, formData);

            navigate('/admin'); 
        } catch (error) {
            setError('Failed to update user.');
            console.error(error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Edit Team Member</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>

            <div className='role-dropdown'>
            <label style={{marginRight:"2rem"}}>
                    Name:
                    
                </label>
                <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
            </div>
                
            <div className='role-dropdown'>
            <label style={{marginRight:"2rem"}}>
                    Email:
                    
                </label>
            <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
            </div>
                
                <div className='role-dropdown'>
                <label>
                    Role:
                </label>
                <div>
                <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                </select>
                </div>
                </div>
                
                

                {formData.role === 'Employee' && (
                    <label>
                        Manager:
                        <select
                            name="managerId"
                            value={formData.managerId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select a Manager</option>
                            {managers.map((manager) => (
                                <option key={manager._id} value={manager._id}>
                                    {manager.name} ({manager.email})
                                </option>
                            ))}
                        </select>
                    </label>
                )}

                <div className='register-btns'>
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
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

export default EditMember;


