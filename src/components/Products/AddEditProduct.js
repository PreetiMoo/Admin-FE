import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/components.css';
import '../../styles/App.css';

const AddEditProduct = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState({
    name: '', 
    description: '', 
    price: '', 
    image: ''
  }); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/products/${id}`, {
            withCredentials: true,
          });
          setProduct(response.data); 
        } catch (error) {
          setError('Failed to fetch product data.');
          console.error(error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSave = async () => {
	try {
	  const updatedProduct = { 
		...product, 
		price: parseFloat(product.price) 
	  };
  
	  
	  const allowedFields = ['name', 'description', 'price', 'image'];
	  const filteredProduct = Object.keys(updatedProduct)
		.filter(key => allowedFields.includes(key))
		.reduce((obj, key) => {
		  obj[key] = updatedProduct[key];
		  return obj;
		}, {});
  
	  let response;
	  if (id) {
		response = await api.patch(`/products/${id}`, filteredProduct, { withCredentials: true });
	  } else {
		response = await api.post('/products', filteredProduct, { withCredentials: true });
	  }
  
	  if (response.status === 200 || response.status === 201) {
		
		navigate('/manager');
	  } else {
		
		setError('Unexpected error occurred. Please try again.');
	  }
	} catch (error) {
	  
	  setError(id ? 'Failed to update product.' : 'Failed to add product.');
	  console.error('Error saving product:', error);
	}
  };
  
  
  

  return (
    <div>
      <h1>{id ? 'Edit Product' : 'Add Product'}</h1>
      {error && <p>{error}</p>}
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" onClick={handleSave}>
          {id ? 'Save Changes' : 'Add Product'}
        </button>
		<button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/manager')}
                >
                    Cancel
                </button>
      </form>
    </div>
  );
};

export default AddEditProduct;
