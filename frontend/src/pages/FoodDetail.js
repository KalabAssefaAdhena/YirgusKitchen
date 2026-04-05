import React, { useState, useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';
import { useParams, useNavigate } from 'react-router-dom';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FoodDetail = () => {
  const userId = localStorage.getItem('userId');
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/foods/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setFood(data.food);
      })
      .catch((error) => console.error('Error fetching food:', error));

    fetch(`http://127.0.0.1:8000/api/reviews/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          foodId: food.id,
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        toast.success(data.message || 'Item added to cart.');
        setTimeout(() => {
          navigate('/cart');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      toast.error('An error occurred while adding item to cart');
    }
  };

  const fetchReviews = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`);
    const data = await res.json();
    setReviews(data);
  };
  const handleDeleteReview = async (revId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this review ?',
    );
    if (!confirmDelete) return;

    const res = await fetch(`http://127.0.0.1:8000/api/review_edit/${revId}/`, {
      method: 'DELETE',
    });
    if (res.ok) {
      toast.success('Review deleted');
      fetchReviews();
    } else {
      toast.error('Failed to delete');
    }
  };

  const renderStars = (count, clickable = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = clickable ? i <= (hoverRating || count) : i <= count;
      stars.push(
        <i
          key={i}
          className={`fa-star ${filled ? 'fas text-warning' : 'far text-secondary'}`}
          style={{
            cursor: clickable ? 'pointer' : 'default',
            fontSize: '20px',
            marginRight: '4px',
          }}
          onClick={clickable ? () => setRating(i) : undefined}
          onMouseEnter={clickable ? () => setHoverRating(i) : undefined}
          onMouseLeave={clickable ? () => setHoverRating(0) : undefined}
        ></i>,
      );
    }
    return stars;
  };

  const handleEditReview = (rev) => {
    setRating(rev.rating);
    setComment(rev.comment);
    setEditId(rev.id);
  };

  const handleReviewSubmit = async () => {
    if (!userId) {
      toast.warning('Please login first to submit review');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating from 1 to 5');
      return;
    }
    const payload = {
      user_id: userId,
      food: id,
      rating,
      comment,
    };
    const url = editId
      ? `http://127.0.0.1:8000/api/review_edit/${editId}/`
      : `http://127.0.0.1:8000/api/reviews/add/${id}/`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editId ? 'Review updated' : 'Review submitted');
        setComment('');
        setRating(0);
        setEditId(null);
        const updatedReviews = await fetch(
          `http://127.0.0.1:8000/api/reviews/${id}/`,
        ).then((res) => res.json());
        setReviews(updatedReviews);
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (!food) return <div className="text-center">Loading...</div>;

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="container py-5">
        <div className="row text-primary">
          <div className="col-md-5 text-center">
            <Zoom>
              <img
                src={`http://127.0.0.1:8000${food.image}`}
                style={{
                  maxHeight: '300px',
                  width: '100%',
                  objectFit: 'cover',
                }}
                alt=""
              />
            </Zoom>
          </div>
          <div className="col-md-7">
            <h2>{food.item_name}</h2>
            <p className="text-muted">{food.item_description}</p>
            <p>
              <strong>Category: </strong>
              {food.category_name}
            </p>
            <h4>ETB {food.item_price}</h4>
            <p className="mt-3">
              Shipping: <strong>Free</strong>
            </p>
            {food.is_available ? (
              <button
                onClick={handleAddToCart}
                className="btn btn-warning btn-lg mt-3 px-4"
              >
                <i className="fas fa-cart-plus me-1"></i>Add to Cart
              </button>
            ) : (
              <div title="This item is currently unavailable. Please check back later.">
                <button to="" className="btn btn-outline-secondary btn-sm ms-2">
                  <i className="fas fa-times-circle me-1"></i> Currently Not
                  Available
                </button>
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className="mt-5">
          <h4>Customer Reviews</h4>
          {reviews.length === 0 ? (
            <p className="text-muted fst-italic">
              No reviews yet. Be the first to share your thought!
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="border-bottom mb-3 pb-2">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{rev.user_name}</strong>
                    <span className="ms-2">{renderStars(rev.rating)}</span>
                  </div>
                  {rev.user === parseInt(userId) && (
                    <div className="text-end">
                      <i
                        className="fas fa-edit text-primary me-2"
                        style={{ cursor: 'pointer', fontSize: '14px' }}
                        title="Edit"
                        onClick={() => handleEditReview(rev)}
                      ></i>
                      <i
                        className="fas fa-trash-alt text-danger me-2"
                        style={{ cursor: 'pointer', fontSize: '14px' }}
                        title="Delete"
                        onClick={() => handleDeleteReview(rev.id)}
                      ></i>
                    </div>
                  )}
                </div>
                <div className="">
                  <p className="mb-1">{rev.comment}</p>
                  <p className="text-muted">
                    {new Date(rev.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-5">
          <h5>
            <i className="fas fa-open me-1"></i>Write a Review
          </h5>
          <div className="mb-3">
            <label className="form-label">Your Rating</label>
            <div>{renderStars(rating, true)}</div>
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Write your review..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <button className="btn btn-success " onClick={handleReviewSubmit}>
            <i className="fas fa-paper-plane"></i>
            Submit Review
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FoodDetail;
