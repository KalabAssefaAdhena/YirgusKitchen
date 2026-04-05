import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/add-category/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category_name: categoryName }),
      });
      const data = await response.json();
      if (response.status === 201) {
        toast.success(data.message);
        setCategoryName('');
      } else {
        toast.error('Failed to add category');
      }
    } catch (error) {
      toast.error('An error occurred while adding the category');
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
              Add Category
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setCategoryName(e.target.value)}
                  value={categoryName}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                <i className="fas fa-plus"></i>Add Category
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <i
            className="fas fa-utensils"
            style={{ fontSize: 180, color: '#e5e5e5' }}
          ></i>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddCategory;
