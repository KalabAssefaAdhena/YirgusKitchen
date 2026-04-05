import React from 'react';
import {
  FaBars,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ newOrders, toggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light  bg-white border-bottom px-3 shadow-sm">
      <button class="btn btn-outline-dark me-3" onClick={toggleSidebar}>
        {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      <span className="navbar-brand fw-semibold">
        <i className="fas fa-utensils me-2"></i>Yirgu's Kitchen Admin
      </span>
      <button className="navbar-toggler border-0 ms-auto">
        <FaBars />
      </button>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto align-items-center gap-3">
          <li className="nav-item position-relative">
            <button
              onClick={() => {
                if (newOrders > 0) {
                  navigate('/order-not-confirmed');
                }
              }}
              title={newOrders > 0 ? 'View New Orders' : 'No New Orders'}
              className=" btn btn-outline-secondary position-relative"
            >
              <FaBell />
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {newOrders}
              </span>
            </button>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className=" btn btn-outline-danger">
              <FaSignOutAlt className="me-1" /> Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminHeader;
