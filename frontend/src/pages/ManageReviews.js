import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageReviews = () => {
  const adminUser = localStorage.getItem('adminUser');

  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }

    fetch('http://127.0.0.1:8000/api/all_reviews/')
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => console.error('Error fetching:', error));
  }, [adminUser, navigate]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review ?')) {
      fetch(`http://127.0.0.1:8000/api/delete_review/${id}/`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.message || 'Review deleted successfully');
          setReviews(reviews.filter((review) => review.id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div>
        <h3 className="text-center text-primary mb-4">
          <i className=" fas fa-star me-1"></i>Manage of All Reviews
        </h3>
        <h5 className="text-end text-muted">
          {' '}
          <i className="fas fa-database me-1"></i>Total{' '}
          <span className="ms-2 badge bg-success">{reviews.length}</span>
        </h5>

        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Food Item</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={review.id}>
                <td>{index + 1}</td>
                <td>{review.food_name}</td>
                <td>{review.user_name}</td>
                <td>
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`text-warning fa-star ${i < review.rating ? 'fas' : 'far'}`}
                    ></i>
                  ))}
                </td>
                <td>{review.comment}</td>
                <td>{new Date(review.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="btn btn-sm btn-danger"
                  >
                    <i className="fas fa-trash-alt me-1"></i>Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageReviews;
