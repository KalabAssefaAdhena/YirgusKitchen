import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddFood = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    item_description: '',
    item_price: '',
    image: null,
    item_quantity: '',
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.categories);
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('category', formData.category);
      fd.append('item_name', formData.item_name);
      fd.append('item_description', formData.item_description);
      fd.append('item_price', formData.item_price);
      fd.append('item_quantity', formData.item_quantity);
      if (formData.image) {
        fd.append('image', formData.image);
      }

      const response = await fetch('http://127.0.0.1:8000/api/add-food-item/', {
        method: 'POST',
        body: fd,
      });
      const data = await response.json();
      if (response.status === 201) {
        toast.success(data.message);
        setFormData({
          category: '',
          item_name: '',
          item_description: '',
          item_price: '',
          image: null,
          item_quantity: '',
        });
      } else {
        toast.error(data.message || 'Failed to add food item');
      }
    } catch (error) {
      toast.error('An error occurred while adding the food item');
    }
  };
  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow-sm rounded">
            <h4 className="mb-4 text-primary d-flex align-items-center">
              <i className="fas fa-plus-circle text-primary me-2"></i>
              Add Food Item
            </h4>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Food Category</label>
                <select
                  className="form-control"
                  onChange={handleChange}
                  value={formData.category}
                  name="category"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Food Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.item_name}
                  name="item_name"
                  placeholder="Enter food item name"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  onChange={handleChange}
                  value={formData.item_description}
                  name="item_description"
                  placeholder="Enter description"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.item_quantity}
                  name="item_quantity"
                  placeholder="e.g. 2pcs"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price (ETB)</label>
                <input
                  type="number"
                  step={0.01}
                  className="form-control"
                  onChange={handleChange}
                  value={formData.item_price}
                  name="item_price"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleChange}
                  name="image"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                <i className="fas fa-plus"></i>Add Food Item
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <i
            className="fas fa-pizza-slice"
            style={{ fontSize: 180, color: '#e5e5e5' }}
          ></i>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddFood;
