import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { FaBoxOpen, FaInfoCircle, FaMapMarkedAlt } from 'react-icons/fa';

const MyOrders = () => {
  const userId = localStorage.getItem('userId');
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetch(`http://127.0.0.1:8000/api/orders/${userId}/`)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }, [userId, navigate]);

  const getStatusBadge = (stat) => {
    const statusLower = stat.toLowerCase();
    if (statusLower.includes('delievered')) return 'success';
    if (statusLower.includes('cancel')) return 'danger';
    if (statusLower.includes('confirmed')) return 'info';
    if (statusLower.includes('prepared')) return 'warning';
    return 'secondary';
  };

  return (
    <PublicLayout>
      <div className="container py-5 text-primary">
        <h3 className="text-center mb-4">
          <FaBoxOpen className="text-warning" size={50} /> My Orders
        </h3>
        {orders.length === 0 ? (
          <p className="text-center text-muted">
            You have not placed any orders yet.
          </p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="card mb-4 shadow-sm">
              <div className="card-body d-flex align-items-center flex-wrap">
                <div className="me-2">
                  <FaBoxOpen className="text-warning" size={50} />
                </div>
                <div className="flex-grow-1">
                  <h5 className="mb-1">
                    <Link>Order # {order.order_number}</Link>
                  </h5>
                  <p className="text-muted mb-1">
                    <strong>Date: </strong>{' '}
                    {new Date(order.order_time).toLocaleString()}{' '}
                  </p>
                  <span
                    className={`badge bg-${getStatusBadge(order.order_final_status)}`}
                  >
                    {order.order_final_status}
                  </span>
                </div>
                <div className="mt-3 mt-md-0">
                  <Link
                    to={`/track-order/${order.order_number}`}
                    className="btn btn-outline-secondary btn-sm me-2"
                  >
                    <FaMapMarkedAlt /> Track
                  </Link>
                  <Link
                    to={`/order-details/${order.order_number}`}
                    className="btn btn-outline-primary btn-sm me-2"
                  >
                    <FaInfoCircle /> View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PublicLayout>
  );
};

export default MyOrders;
