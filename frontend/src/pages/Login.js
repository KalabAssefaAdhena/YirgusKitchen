import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    emailContact: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { emailContact, password } = formData;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailContact,
          password,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.message || 'Login successful');
        setFormData({
          emailContact: '',
          password: '',
        });
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', data.userName);

        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to login user');
      }
    } catch (error) {
      toast.error('An error occurred while logging in the user');
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 p-4">
            <h3 className="text-center text-primary mb-4 ">
              <FaSignInAlt className="me-2" /> User Login
            </h3>
            <form onSubmit={handleSubmit} className="card p-4 shadow">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.emailContact}
                  name="emailContact"
                  placeholder="Email or Mobile Number"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.password}
                  name="password"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  <FaSignInAlt className="me-2" /> Login
                </button>
                <Link to="/register" className="btn btn-outline-secondary">
                  <FaUserPlus className="me-2" /> Register
                </Link>
              </div>
            </form>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <img
                src="/images/login.jpeg"
                alt=""
                className="img-fluid rounded-3 w-75"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;
