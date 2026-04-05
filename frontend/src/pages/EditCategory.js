import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const EditCategory = () => {
  const [categoryName, setCategoryName] = useState('');

  const navigate = useNavigate();
  const adminUser = localStorage.getItem('adminUser');
  const { id } = useParams();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }
    fetch(`http://127.0.0.1:8000/api/category/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setCategoryName(data.category_name);
      })
      .catch((error) => console.error('Error editing categories:', error));
  }, [id, navigate, adminUser]);

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/category/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_name: categoryName }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message);
        setTimeout(() => {
          navigate('/manage-category');
        }, 1000);
      })
      .catch((error) => console.error('Error editing categories:', error));
  };
  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow-sm rounded">
            <h4 className="mb-4 text-primary d-flex align-items-center">
              <i className="fas fa-pen-square text-primary me-2"></i>
              Edit Food Category
            </h4>
            <form onSubmit={handleUpdate}>
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
                <i className="fas fa-save"></i>Update Category
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

export default EditCategory;
