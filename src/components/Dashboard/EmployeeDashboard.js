import React, { useEffect, useState } from 'react';
import api from '../../services/api'; 
import { useNavigate } from 'react-router-dom'; 
import { Modal, Button, Form } from 'react-bootstrap';
import OrderList from '../Orders/OrderList';
import { Link } from 'react-router-dom';
import '../../styles/EmployeeDashboard.css'
import '../../styles/App.css'


const EmployeeDashboard = () => {
  const [products, setProducts] = useState([]); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  const [showModal, setShowModal] = useState(false); 
  const [customerName, setCustomerName] = useState(''); 
  const[product, setProduct] = useState(null)

  const [showOrderListModal, setShowOrderListModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  }

  const handleShow = (product) => {
    setProduct(product)
      setShowModal(true)
    }
  
  const handleNameChange = (e) => setCustomerName(e.target.value);

  useEffect(() => {
    

    const fetchProducts = async () => {
      try {
        const response = await api.get('/products'); 
        setProducts(response.data);
      } catch (error) {
        setError('Failed to fetch products.');
        console.error(error);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleOrder = async () => {
    try {
      if (!customerName) {
        alert('Please enter a customer name');
        return;
      }

      const order = {
        products: [
          {
            product: product._id,
            quantity: 1, 
          },
        ],
        customerName, 
      };

      const response = await api.post('/orders', order);
      alert('Order placed successfully!');
      handleClose(); 
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };


  return (
    <div className="dashboard-container">
    <header className="dashboard-header">
      <h1>Employee Dashboard</h1>
      {error && <p className="error-text">{error}</p>}
    </header>

    <div className="button-container">
      <button className="btn btn-primary" onClick={() => setShowOrderListModal(true)}>
        Order List
      </button>
    </div>

    <section className="products-section">
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>
  <button className="btn btn-secondary small-button" onClick={() => handleShow(product)}>
    Place Order
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>

    {showModal && (<div className='modal'>

     
      <div className='modal-content'>
      <button className="close-modal" onClick={handleClose}>
      &times;
    </button>
        <form>
          
          <div className='role-dropdown'>
          <label style={{flex:"1"}}>Customer Name</label>
            <input
              style={{flex:"1"}}
              type="text"
              placeholder="Enter your name"
              value={customerName}
              onChange={handleNameChange}
            />
          </div>
          
          <div className='register-btns'>
          <button variant="secondary" onClick={handleClose}>
          Close
        </button>
        <button variant="primary" onClick={handleOrder}>
          Submit Order
        </button>
          </div>
          
        </form>
      </div>
    </div>)}

    {showOrderListModal && (
      <div className="modal">
        <div className="modal-content">
          <h2>Order List</h2>
          <button className="close-modal" onClick={() => setShowOrderListModal(false)}>
            &times;
          </button>
          <OrderList />
        </div>
      </div>
    )}
  </div>
  );
};

export default EmployeeDashboard;
