import React, { useState, useEffect } from 'react';
import {
  FaCogs,
  FaHeart,
  FaHome,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaTruck,
  FaUser,
  FaUserCircle,
  FaUserPlus,
  FaUserShield,
  FaUtensils,
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/layout.css';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const PublicLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const { cartCount, setCartCount } = useCart();
  const { wishlistCount, setWishlistCount } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');

    if (storedUserId && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      const fetchCartCount = async () => {
        const res = await fetch(
          `http://127.0.0.1:8000/api/cart/${storedUserId}`,
        );
        const data = await res.json();

        setCartCount(data.length);
      };
      const fetchWishlistCount = async () => {
        const res = await fetch(
          `http://127.0.0.1:8000/api/wishlist/${storedUserId}`,
        );
        const data = await res.json();
        setWishlistCount(data.length);
      };
      fetchWishlistCount();
      fetchCartCount();
    }
  }, [setCartCount, setWishlistCount]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    setCartCount(0);
    setWishlistCount(0);
    navigate('/login');
  };

  return (
    <div>
      {' '}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            <FaUtensils className="me-1" /> Yirgu's Kitchen
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-1">
                <Link
                  className={`nav-link ${location.pathname === '/' ? 'active-nav-link' : ''}  `}
                  to="/"
                >
                  <FaHome className="me-1" /> Home
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link
                  className={`nav-link ${location.pathname === '/menu' ? 'active-nav-link' : ''}  `}
                  to="/menu"
                >
                  <FaUtensils className="me-1" /> Menu
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link
                  className={`nav-link ${location.pathname === '/track' ? 'active-nav-link' : ''}  `}
                  to="/track"
                >
                  <FaTruck className="me-1" /> Track
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li className="nav-item mx-1">
                    <Link
                      className={`nav-link ${location.pathname === '/my-orders' ? 'active-nav-link' : ''}  `}
                      to="/my-orders"
                    >
                      <FaUser className="me-1" /> My Orders
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link
                      className={`nav-link ${location.pathname === '/cart' ? 'active-nav-link' : ''}  `}
                      to="/cart"
                    >
                      <FaShoppingCart className="me-1" /> Cart{' '}
                      {cartCount > 0 && (
                        <span className="badge bg-light text-dark ms-1">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link
                      className={`nav-link ${location.pathname === '/wishlist' ? 'active-nav-link' : ''}  `}
                      to="/wishlist"
                    >
                      <FaHeart className="me-1" /> Wishlist{' '}
                      {wishlistCount > 0 && (
                        <span className="badge bg-light text-dark ms-1">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <Link
                      className={`nav-link dropdown-toggle text-capitalize ${location.pathname === '/profile' || location.pathname === '/change-password' ? 'active-nav-link' : ''}  `}
                      to=""
                      id="navbarDropdown"
                      data-bs-toggle="dropdown"
                    >
                      <FaUserCircle className="me-1" /> {userName}
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link
                          className={`dropdown-item ${location.pathname === '/profile' ? 'active-dropdown' : ''}`}
                          to="/profile"
                        >
                          <FaUser className="me-1" />
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className={`dropdown-item ${location.pathname === '/change-password' ? 'active-dropdown' : ''}`}
                          to="/change-password"
                        >
                          <FaCogs className="me-1" />
                          Settings
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="me-1" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item mx-1">
                    <Link
                      className={`nav-link ${location.pathname === '/register' ? 'active-nav-link' : ''}  `}
                      to="/register"
                    >
                      <FaUserPlus className="me-1" /> Register
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link
                      className={`nav-link ${location.pathname === '/login' ? 'active-nav-link' : ''}  `}
                      to="/login"
                    >
                      <FaSignInAlt className="me-1" /> Login
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link
                      className={`nav-link ${location.pathname === '/admin-login' ? 'active-nav-link' : ''}  `}
                      to="/admin-login"
                    >
                      <FaUserShield className="me-1" /> Admin
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div>{children}</div>
      <footer className="text-center py-3 mt-5">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} Food Ordering System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
