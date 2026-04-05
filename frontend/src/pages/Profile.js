import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    reg_date: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetch(`http://127.0.0.1:8000/api/user/${userId}/`)
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
      });
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/update/${userId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
          }),
        },
      );
      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.message || 'Profile Updated successful');
      } else {
        toast.error(data.message || 'something went wrong');
      }
    } catch (error) {
      toast.error('An error occurred while updating the user profile');
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <h3 className="text-center text-primary mb-4">
          {' '}
          <i className="fas fa-user-circle me-1"></i>My Profile
        </h3>
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="mb-1 ">First Name</label>
              <input
                type="text"
                className="form-control"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="mb-1 ">Last Name</label>
              <input
                type="text"
                className="form-control"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="mb-1 ">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                disabled
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="mb-1 ">Mobile Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.mobile}
                disabled
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="mb-1 ">Registration Date</label>
              <input
                type="text"
                className="form-control"
                value={new Date(formData.reg_date).toLocaleString()}
                disabled
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            <i className="fas fa-save me-2"></i> Update Profile
          </button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default Profile;
