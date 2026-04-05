import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../styles/admin.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOrders, setNewOrders] = useState(0);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/dashboard_metrics/')
      .then((response) => response.json())
      .then((data) => {
        setNewOrders(data.new_orders);
      });
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex">
      {sidebarOpen && <AdminSidebar />}

      <div
        id="page-content-wrapper"
        className={`flex-grow-1 ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}
      >
        <AdminHeader
          newOrders={newOrders}
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <div className="container-fluid mt-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
