import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate } from 'react-router-dom';

const FoodBeingPrepared = () => {
  const adminUser = localStorage.getItem('adminUser');

  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }

    fetch('http://127.0.0.1:8000/api/food_being_prepared/')
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => console.error('Error fetching:', error));
  }, [adminUser, navigate]);
  return (
    <AdminLayout>
      <div>
        <h3 className="text-center text-primary mb-4">
          <i className=" fas fa-list-alt me-1"></i>Details of Orders Being
          Prepared
        </h3>
        <h5 className="text-end text-muted">
          {' '}
          <i className="fas fa-database me-1"></i>Total Orders Being Prepared{' '}
          <span className="ms-2 badge bg-success">{orders.length}</span>
        </h5>

        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Order Number</th>
              <th>Order Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.order_number}</td>
                <td>{new Date(order.order_time).toLocaleDateString()}</td>
                <td>
                  <a
                    href={`/admin-view-order-detail/${order.order_number}`}
                    className="btn btn-sm btn-info me-2"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default FoodBeingPrepared;
