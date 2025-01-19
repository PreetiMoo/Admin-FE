import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import api from '../../services/api'; 
import '../../styles/App.css'
import '../../styles/components.css'
import '../../styles/EmployeeDashboard.css'


const OrderList = ({role}) => {
  const [orders, setOrders] = useState([]); 

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders'); 
        setOrders(response.data); 
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (e, orderId) => {
	setOrders((prevOrders) =>
	  prevOrders.map((order) =>
		order._id === orderId ? { ...order, newStatus: e.target.value } : order
	  )
	);
  };
  
  const submitStatusChange = async (orderId) => {
	const updatedOrder = orders.find((order) => order._id === orderId);
  
	if (updatedOrder?.newStatus) {
	  try {
		await api.patch(`/orders/${orderId}`, { status: updatedOrder.newStatus });
		alert('Order status updated successfully!');
		
		const response = await api.get('/orders');
		setOrders(response.data);
	  } catch (error) {
		console.error('Error updating status:', error);
		alert('Failed to update order status.');
	  }
	} else {
	  alert('Please select a status before submitting.');
	}
  };
  

  return (
    <div className="order-list-container">
      {orders.length === 0 ? (
        <p className="loading-text">Loading orders...</p>
      ) : (
        <Table striped bordered hover responsive className="products-table">
        
          <thead className="order-list-header">
            <tr>
              <th>Customer Name</th>
              <th>Product Name</th>
              <th>Total</th>
              <th>Created At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.customerName}</td>
                <td>{order.products.map((product) => product.product.name).join(', ')}</td>
                <td>${order.total}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  {role === 'Manager' && order.status === 'Pending' ? (
                    <div className="status-update-container">
                      <select
                        className="status-dropdown"
                        value={order.newStatus || ''}
                        onChange={(e) => handleStatusChange(e, order._id)}
                      >
                        <option value="" disabled>
                          {order.status}
                        </option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <button
                        className="submit-status-btn"
                        onClick={() => submitStatusChange(order._id)}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    order.status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default OrderList;
