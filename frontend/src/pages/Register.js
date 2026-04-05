import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    repeatPassword: '',
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

    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      repeatPassword,
    } = formData;
    if (password !== repeatPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          mobileNumber,
          password,
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        toast.success(data.message || 'Registration successful');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          mobileNumber: '',
          password: '',
          repeatPassword: '',
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to register user');
      }
    } catch (error) {
      toast.error('An error occurred while registering the user');
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <div className="row shadow-lg rounded-4">
          <div className="col-md-6 p-4">
            <h3 className="text-center text-primary mb-4 ">
              <i className="fas fa-user-plus me-2"></i>User Registration
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.firstName}
                  name="firstName"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.lastName}
                  name="lastName"
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.email}
                  name="email"
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.mobileNumber}
                  name="mobileNumber"
                  placeholder="Mobile Number"
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
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.repeatPassword}
                  name="repeatPassword"
                  placeholder="Repeat Password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                <i className="fa fa-user-check me-2"></i> Submit
              </button>
            </form>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="p-4 text-center">
              <img
                src="/images/register.jpeg"
                alt=""
                className="img-fluid"
                style={{ maxHeight: '400px' }}
              />
              <h5 className="mt-3">Registration is fast, secure and free.</h5>
              <p className="text-muted small">
                Join our food family and enjoy delicious meals delivered to your
                doorstep.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Register;
