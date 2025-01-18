import React, { useEffect, useState } from 'react';
import api from '../../services/api'; 
import { useNavigate } from 'react-router-dom'; 
import { Modal, Button, Form } from 'react-bootstrap';
import OrderList from '../Orders/OrderList';
import { Link } from 'react-router-dom';

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
        const response = await api.get('/products', { withCredentials: true }); 
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

      const response = await api.post('/orders', order, { withCredentials: true });
      alert('Order placed successfully!');
      handleClose(); 
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order.');
    }
  };


  return (
    <div>
      <h1>Employee Dashboard</h1>
      {error && <p>{error}</p>}
      <button className="product-list" onClick={() => setShowOrderListModal(true)}>
                        Order List
                    </button>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table>
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
                  <button onClick={() => handleShow(product)}>Place Order</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Customer Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="customerName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={customerName}
                onChange={handleNameChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleOrder}>
            Submit Order
          </Button>
        </Modal.Footer>
      </Modal>

      {showOrderListModal && (
                      <div className="modal">
                          <div className="modal-content">
                              <h2>Order List</h2>
                              <button className="close-modal" onClick={() => setShowOrderListModal(false)}>
                                  &times;
                              </button>
                              <OrderList/>
                          </div>
                      </div>
                  )}

    </div>
  );
};

export default EmployeeDashboard;
