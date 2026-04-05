import React, { useState, useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';
import '../styles/home.css';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const storedUserId = localStorage.getItem('userId');
  const [wishlist, setWishlist] = useState([]);
  const { setWishlistCount } = useWishlist();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (storedUserId) {
        const res = await fetch(
          `http://127.0.0.1:8000/api/wishlist/${storedUserId}`,
        );
        const data = await res.json();
        setWishlist(data);
      }
    };
    fetchWishlist();
  }, [storedUserId]);

  const removeWishlist = async (foodId) => {
    const fetchWishlist = async () => {
      if (storedUserId) {
        const res = await fetch(
          `http://127.0.0.1:8000/api/wishlist/${storedUserId}`,
        );
        const data = await res.json();
        setWishlist(data);
      }
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/wishlist/remove/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: storedUserId, food_id: foodId }),
        },
      );
      if (response.ok) {
        const res = await fetch(
          `http://127.0.0.1:8000/api/wishlist/${storedUserId}`,
        );
        const data = await res.json();
        setWishlistCount(data.length);
        fetchWishlist();
        toast.success('Removed from wishlist');
      } else {
        toast.error('Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error :', error);
    }
  };
  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="container py-5">
        <h2 className="mb-4">My Wishlist</h2>

        <div className="row mt-4">
          {wishlist.length === 0 ? (
            <p className="text-center">No items in Wishlist</p>
          ) : (
            wishlist.map((food, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card hovereffect">
                  <div className="position-relative">
                    <img
                      src={`http://127.0.0.1:8000${food.image}`}
                      className="card-img-top"
                      style={{
                        height: '180px',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                      alt=""
                    />
                    <i
                      onClick={() => removeWishlist(food.food_id)}
                      className={` fas fa-heart heart-anim position-absolute top-0 end-0 m-2  text-danger`}
                      style={{
                        cursor: 'pointer',
                        background: 'white',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}
                    ></i>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/food/${food.food_id}`}>{food.item_name}</Link>
                    </h5>
                    <p className="card-text text-muted">
                      {food.item_description?.slice(0, 40)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">ETB {food.item_price}</span>
                      {food.is_available ? (
                        <Link
                          to={`/food/${food.food_id}`}
                          className="btn btn-outline-primary btn-sm ms-2"
                        >
                          <i className="fas fa-shopping-basket me-1"></i>Order
                          Now
                        </Link>
                      ) : (
                        <div title="This item is currently unavailable. Please check back later.">
                          <button
                            to=""
                            className="btn btn-outline-secondary btn-sm ms-2"
                          >
                            <i className="fas fa-times-circle me-1"></i>{' '}
                            Currently Not Available
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Wishlist;
