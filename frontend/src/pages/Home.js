import React, { useState, useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';
import '../styles/home.css';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWishlist } from '../context/WishlistContext';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const storedUserId = localStorage.getItem('userId');
  const { setWishlistCount } = useWishlist();

  const [rating, setRating] = useState({});
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/random_foods/')
      .then((response) => response.json())
      .then((data) => {
        setFoods(data.foods);
      })
      .catch((error) => console.error('Error fetching foods:', error));
  }, []);

  useEffect(() => {
    if (storedUserId) {
      fetch(`http://127.0.0.1:8000/api/wishlist/${storedUserId}`)
        .then((response) => response.json())
        .then((data) => {
          const wishlistIds = data.map((item) => item.food_id);
          setWishlist(wishlistIds);
        })
        .catch((error) => console.error('Error :', error));
    }
  }, [storedUserId]);

  useEffect(() => {
    const fetchAllRatings = async () => {
      const allRating = {};
      for (const food of foods) {
        const response = await fetch(
          `http://127.0.0.1:8000/api/food_rating_summary/${food.id}/`,
        );
        const data = await response.json();
        allRating[food.id] = data;
      }
      setRating(allRating);
    };
    if (foods.length > 0) {
      fetchAllRatings();
    }
  }, [foods]);

  const toggleWishlist = async (foodId) => {
    if (!storedUserId) {
      toast.info('Please log in to use wishlist');
      return;
    }
    const isWishlisted = wishlist.includes(foodId);
    const endpoint = isWishlisted ? 'remove' : 'add';

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/wishlist/${endpoint}/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: storedUserId, food_id: foodId }),
        },
      );
      if (response.ok) {
        setWishlist((prev) =>
          isWishlisted ? prev.filter((id) => id !== foodId) : [...prev, foodId],
        );
        const res = await fetch(
          `http://127.0.0.1:8000/api/wishlist/${storedUserId}`,
        );
        const data = await res.json();
        setWishlistCount(data.length);
        toast.success(
          isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
        );
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

      <section
        className="py-5 hero text-center"
        style={{
          backgroundImage: "url('/images/Food1.jpeg')",
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '40px 20px',
            borderRadius: '10px',
          }}
        >
          <h1 className="display-4">Quick & Hot Food, Delivered to You</h1>
          <p className="lead ">
            Craving something tasty? Let's get it to your door!
          </p>
          <form
            method="GET"
            action="/search"
            className="d-flex mt-3"
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <input
              type="text"
              name="q"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              placeholder="I would like to eat..."
              className="form-control"
            />
            <button
              className="btn btn-warning px-4"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              Search
            </button>
          </form>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <h2 className="text-primary mb-4">Featured Foods</h2>
          <div className="row mt-4">
            {foods.length === 0 ? (
              <p className="text-center">
                No foods found matching your search. Please try a different
                keyword.
              </p>
            ) : (
              foods.map((food, index) => (
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
                        onClick={() => toggleWishlist(food.id)}
                        className={`${wishlist.includes(food.id) ? 'fas' : 'far'} fa-heart heart-anim position-absolute top-0 end-0 m-2  text-danger`}
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
                        <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                      </h5>
                      <p className="card-text text-muted">
                        {food.item_description?.slice(0, 40)}...
                      </p>

                      {rating[food.id] && (
                        <div
                          className="mb-2 rating-summary-wrapper position-relative"
                          onMouseEnter={() => setHovered(food.id)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          <div>
                            <span className="text-warning">
                              {Array(Math.round(rating[food.id]?.average))
                                .fill()
                                .map((_, i) => (
                                  <i key={i} className="fas fa-star"></i>
                                ))}
                              {Array(5 - Math.round(rating[food.id]?.average))
                                .fill()
                                .map((_, i) => (
                                  <i key={i} className="far fa-star"></i>
                                ))}
                            </span>
                            <small className="text-muted ms-2">
                              {rating[food.id]?.average.toFixed(1)} (
                              {rating[food.id]?.total_reviews} ratings)
                            </small>
                          </div>
                          {hovered === food.id &&
                            rating[food.id]?.breakdown && (
                              <div
                                className="hover-popup p-3 border rounded shadow position-absolute bg-white"
                                style={{
                                  bottom: '100%',
                                  width: '100%',
                                  marginBottom: '10px',
                                  zIndex: '1000',
                                }}
                              >
                                {[5, 4, 3, 2, 1].map((star) => {
                                  const count =
                                    rating[food.id].breakdown[star] || 0;
                                  const percentage = rating[food.id]
                                    .total_reviews
                                    ? (count / rating[food.id].total_reviews) *
                                      100
                                    : 0;

                                  return (
                                    <div
                                      key={star}
                                      className="mb-1 d-flex align-items-center"
                                    >
                                      <small
                                        className="me-2"
                                        style={{ width: '50px' }}
                                      >
                                        {star} star
                                      </small>
                                      <div className="progress flex-grow-1">
                                        <div
                                          className="progress-bar bg-warning"
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <small className="ms-2">{count}</small>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">ETB {food.item_price}</span>
                        {food.is_available ? (
                          <Link
                            to={`/food/${food.id}`}
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
      </section>
      <section className="py-5 text-white bg-dark">
        <div className="container text-center">
          <h2> Ordering in 3 Simple Steps</h2>
          <div className="row mt-4">
            <div className="col-md-4">
              <h4>1. Pick a dish you love</h4>
              <p>
                Explore our wide variety of delicious dishes and choose your
                favorites.
              </p>
            </div>
            <div className="col-md-4">
              <h4>2. Share your location</h4>
              <p>
                Provide your delivery address so we know where to send your
                order.
              </p>
            </div>
            <div className="col-md-4">
              <h4>3. Enjoy doorstep delivery</h4>
              <p>We'll deliver it right to your doorstep in no time!</p>
            </div>
          </div>
          <p>Pay easily with Cash on Delivery - hassle-free!</p>
        </div>
      </section>
      <section className="py-5 text-dark bg-warning text-center">
        <h4>Ready to Satisfy Your Hunger?</h4>
        <Link to="/menu" className="btn btn-dark btn-lg">
          View Menu
        </Link>
      </section>
    </PublicLayout>
  );
};

export default Home;
