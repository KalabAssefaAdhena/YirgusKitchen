import React, { useState } from 'react';
import { FaLock, FaSignInAlt, FaUser } from 'react-icons/fa';
import '../styles/admin.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicLayout from '../components/PublicLayout';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handlLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/api/admin-login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.status === 200) {
      toast.success(data.message);
      localStorage.setItem('adminUser', data.username);
      setTimeout(() => {
        window.location.href = '/admin-dashboard';
      }, 2000);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <PublicLayout>
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: `url('/images/Ethiopia.jpeg')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div
          className="card p-4 shadow-lg"
          style={{ maxWidth: '400px', width: '100%' }}
        >
          <h4 className="text-center">
            <FaUser className="me-2 icon-fix" /> Admin Login
          </h4>
          <form onSubmit={handlLogin}>
            <div className="mb-3">
              <label className="form-label">
                <FaUser className="me-1 icon-fix" /> Username
              </label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                placeholder="Enter admin username"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <FaLock className="me-1 icon-fix" /> Password
              </label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter admin password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
              <FaSignInAlt /> Login
            </button>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </PublicLayout>
  );
};

export default AdminLogin;
