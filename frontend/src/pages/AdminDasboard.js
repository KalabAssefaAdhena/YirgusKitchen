import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate } from 'react-router-dom';
import '../styles/adminDashboard.css';
import SalesBarChart from '../components/SalesBarChart';
import TopProducts from '../components/TopProducts';
import WeeklySalesChart from '../components/WeeklySalesChart';
import WeeklyUserChart from '../components/WeeklyUserChart';

const AdminDasboard = () => {
  const adminUser = localStorage.getItem('adminUser');
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    total_orders: 0,
    new_orders: 0,
    confirmed_orders: 0,
    food_preparing: 0,
    food_pickup: 0,
    food_delivered: 0,
    cancelled_orders: 0,
    total_users: 0,
    total_categories: 0,
    today_sales: 0,
    week_sales: 0,
    month_sales: 0,
    year_sales: 0,
    total_reviews: 0,
    total_wishlists: 0,
  });
  const cardData = [
    {
      title: 'Total Orders',
      key: 'total_orders',
      color: 'primary',
      icon: 'fas fa-shopping-cart',
    },
    {
      title: 'New Orders',
      key: 'new_orders',
      color: 'secondary',
      icon: 'fas fa-cart-plus',
    },
    {
      title: 'Confirmed Orders',
      key: 'confirmed_orders',
      color: 'info',
      icon: 'fas fa-check-circle',
    },
    {
      title: 'Food Being Prepared',
      key: 'food_preparing',
      color: 'warning',
      icon: 'fas fa-utensils',
    },
    {
      title: 'Food Pickup',
      key: 'food_pickup',
      color: 'dark',
      icon: 'fas fa-motorcycle',
    },
    {
      title: 'Food Delivered',
      key: 'food_delivered',
      color: 'success',
      icon: 'fas fa-truck',
    },
    {
      title: 'Cancelled Orders',
      key: 'cancelled_orders',
      color: 'danger',
      icon: 'fas fa-times-circle',
    },
    {
      title: 'Total Users',
      key: 'total_users',
      color: 'primary',
      icon: 'fas fa-users',
    },
    {
      title: "Today's Sales",
      key: 'today_sales',
      color: 'info',
      icon: 'fas fa-coins',
    },
    {
      title: 'Weekly Sales',
      key: 'week_sales',
      color: 'secondary',
      icon: 'fas fa-calendar-week',
    },
    {
      title: 'Monthly Sales',
      key: 'month_sales',
      color: 'dark',
      icon: 'fas fa-calendar-alt',
    },
    {
      title: 'Yearly Sales',
      key: 'year_sales',
      color: 'success',
      icon: 'fas fa-calendar',
    },
    {
      title: 'Total Categories',
      key: 'total_categories',
      color: 'warning',
      icon: 'fas fa-list',
    },
    {
      title: 'Total Wishlists',
      key: 'total_wishlists',
      color: 'secondary',
      icon: 'fas fa-heart',
    },
    {
      title: 'Total Reviews',
      key: 'total_reviews',
      color: 'primary',
      icon: 'fas fa-star',
    },
  ];

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }
    fetch('http://127.0.0.1:8000/api/dashboard_metrics/')
      .then((response) => response.json())
      .then((data) => {
        setMetrics(data);
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, [adminUser, navigate]);
  return (
    <AdminLayout>
      <div className="row g-3">
        {cardData.map((item, i) => (
          <div className="col-md-3" key={i}>
            <div className={`card card-hover text-white bg-${item.color}`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{item.title}</h5>
                  <h2>
                    {item.key.includes('sales') && <span>ETB</span>}{' '}
                    {metrics[item.key]}
                  </h2>
                </div>
                <i className={`${item.icon} fa-2x`}></i>
              </div>
            </div>
          </div>
        ))}
        <div className="col-md-3">
          <div
            className={`card text-white bg-light d-flex justify-content-between align-items-center p-2`}
          >
            <i className="fas fa-concierge-bell fa-2x text-danger mb-3"></i>
            <p className="text-dark fw-bold text-center mb-0 ">
              Food Ordering <br /> <span className="text-danger">System</span>
            </p>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <SalesBarChart />
        </div>
        <div className="col-md-6">
          <TopProducts />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <WeeklySalesChart />
        </div>
        <div className="col-md-6">
          <WeeklyUserChart />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDasboard;
