import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import '../../styles/components.css';
import '../../styles/App.css';
import OrderList from '../Orders/OrderList';


const AdminDashboard = () => {
    const [team, setTeam] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showProductListModal, setShowProductListModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); 
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
    
    

    
    const fetchTeam = async () => {
        try {
            const response = await api.get('/team');
            setTeam(response.data);
        } catch (error) {
            setError('Failed to fetch team members.');
            console.log("error in fetching team",error);
        }
    };

    
    const fetchProducts = async () => {
        try {
           
                const response = await api.get('/products/');
            setProducts(response.data);
            
            
        } catch (error) {
            setError('Failed to fetch products.');
            console.error(error);
        }
    };

    
    const handleAddProduct = async () => {
        try {
            const response = await api.post('/products/', newProduct);
            setProducts([...products, response.data]);
            setShowProductModal(false);
            setNewProduct({ name: '', description: '', price: '', image: '' });
        } catch (error) {
            setError('Failed to add product.');
            console.error(error);
        }
    };

    
    const handleEditProduct = (product) => {
        setSelectedProduct(product); 
        setShowEditModal(true); 
    };

    
    const handleUpdateProduct = async () => {
        try {
            const { name, description, price, image } = selectedProduct;
            const response = await api.patch(`/products/${selectedProduct._id}`, {
                name,
                description,
                price,
                image,
            }, );
            setProducts(products.map((product) => (product._id === selectedProduct._id ? response.data : product)));
            setShowEditModal(false);
            setSelectedProduct(null); 
        } catch (error) {
            console.error(error);
            setError('Failed to update product.');
        }
    };

    useEffect(() => {
        fetchTeam();
        fetchProducts();
        
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/auth/delete/${id}`);
            setTeam(team.filter((member) => member._id !== id));
        } catch (error) {
            setError('Failed to delete user.');
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {error && <p>{error}</p>}
            
            
            <button style={{"margin":"auto", "width": "auto"}} className="logout btn btn-primary" onClick={() => navigate('/register')}>
                Add Member
            </button>

            
            <h2>Team Members</h2>
            {team.length === 0 ? (
                <p>No team members found.</p>
            ) : (
                <table className="team-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {team.map((member) => (
                            <tr key={member._id}>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.role}</td>
                                <td>
                                    
                                    <FaEdit 
                                        className="btn btn-secondary icon-btn"
                                        onClick={() => navigate(`/auth/update/${member._id}`)}
                                    />
                                    <FaTrashAlt 
                                        className="btn btn-danger icon-btn delete-icon"
                                        onClick={() => handleDelete(member._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            
            <div className="product-card">
                <div className="product-card-header">Products</div>
                <div className="product-card-buttons">
                    <button className="add-product" onClick={() => setShowProductModal(true)}>
                        Add Product
                    </button>
                    <button style={{backgroundColor: "#28a745"}} className="add-product" onClick={() => setShowProductListModal(true)}>
                        Products List
                    </button>
                </div>
            </div>

            
            {showProductModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Product</h2>
                        <button className="close-modal" onClick={() => setShowProductModal(false)}>
                            &times;
                        </button>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddProduct();
                            }}
                        >
                            <input
                                type="text"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                placeholder="Product Name"
                                required
                            />
                            <input
                                type="text"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                placeholder="Description"
                                required
                            />
                            <input
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                placeholder="Price"
                                required
                            />
                            <input
                                type="text"
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                placeholder="Image URL"
                            />
                            <button type="submit" className="btn btn-success">
                                Add Product
                            </button>
                        </form>
                    </div>
                </div>
            )}

            
            {showEditModal && selectedProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Product</h2>
                        <button className="close-modal" onClick={() => setShowEditModal(false)}>
                            &times;
                        </button>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateProduct();
                            }}
                        >
                            <input
                                type="text"
                                value={selectedProduct.name}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                                placeholder="Product Name"
                                required
                            />
                            <input
                                type="text"
                                value={selectedProduct.description}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                                placeholder="Description"
                                required
                            />
                            <input
                                type="number"
                                value={selectedProduct.price}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                                placeholder="Price"
                                required
                            />
                            <input
                                type="text"
                                value={selectedProduct.image}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.value })}
                                placeholder="Image URL"
                            />
                            <button type="submit" className="btn btn-success">
                                Update Product
                            </button>
                        </form>
                    </div>
                </div>
            )}

            
            {showProductListModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Product List</h2>
                        <button className="close-modal" onClick={() => setShowProductListModal(false)}>
                            &times;
                        </button>
                        <ul className="product-list">
                            {products.map((product) => (
                                <li key={product._id}>
                                    <strong>{product.name}</strong>
                                    <FaEdit
                                        className="btn btn-secondary edit-icon"
                                        onClick={() => handleEditProduct(product)} 
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            
        </div>
    );
};

export default AdminDashboard;


