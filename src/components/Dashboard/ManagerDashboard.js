import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa'; 

import api from '../../services/api'; 
import '../../styles/ManagerDashboard.css';
import OrderList from '../Orders/OrderList';

const ManagerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [team, setTeam] = useState([]);
    const [error, setError] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showProductListModal, setShowProductListModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); 
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });
    const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderListModal, setShowOrderListModal] = useState(false);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products/');
                setProducts(response.data);
            } catch (error) {
                setError('Failed to fetch products.');
                console.error(error);
            }
        };

        const fetchTeam = async () => {
            try {
                const response = await api.get('/team/');
                setTeam(response.data);
            } catch (error) {
                setError(error?.response?.data?.error ||'Failed to fetch team members.');
                console.log("error in fetching team",error,error?.response?.data?.error);
            }
        };

        fetchProducts();
        fetchTeam();
    }, []);

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
        setShowProductListModal(false)
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
            }, { withCredentials: true });
            setProducts(products.map((product) => (product._id === selectedProduct._id ? response.data : product)));
            setShowEditModal(false);
            setSelectedProduct(null); 
        } catch (error) {
            console.error(error);
            setError('Failed to update product.');
        }
    };

    return (
        <div className="dashboard-container">
        <header className="dashboard-header">
      <h1>Manager Dashboard</h1>
      {error && <p className="error-text">{error}</p>}
    </header>

    <div className="button-container">
      <button className="btn btn-primary" onClick={() => setShowOrderListModal(true)}>
        Order List
      </button>
    </div>
            
          
            <div className="product-card">
                <div className="product-card-header">Products</div>
                <div className="product-card-buttons">
                    <button className="add-product" onClick={() => setShowProductModal(true)}>
                        Add Product
                    </button>
                    <button className="add-product" onClick={() => setShowProductListModal(true)}>
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
                                        className="edit-icon"
                                        onClick={() => handleEditProduct(product)} 
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            
            <div className="team-card">
                <div className="team-card-header">Team Members</div>
                <table className="team-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {team.length === 0 ? (
                            <tr>
                                <td colSpan="3">No team members found.</td>
                            </tr>
                        ) : (
                            team.map((member) => (
                                <tr key={member._id}>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.role}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showOrderListModal && (
                      <div className="modal">
                          <div className="modal-content">
                              {/* <h2>Order List</h2> */}
                              <button className="close-modal" onClick={() => setShowOrderListModal(false)}>
                                  &times;
                              </button>
                              <OrderList role="Manager"/>
                          </div>
                      </div>
                  )}
        </div>
    );
};

export default ManagerDashboard;


