import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const userId = localStorage.getItem('userId');
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate();
  const { setCartCount } = useCart();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetch(`http://127.0.0.1:8000/api/cart/${userId}/`)
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data);
        const total = data.reduce(
          (sum, item) => sum + item.food.item_price * item.quantity,
          0,
        );
        setGrandTotal(total);
      })
      .catch((error) => console.error('Error fetching food:', error));
  }, [userId, navigate]);

  const updateQuantity = async (orderId, newQty) => {
    if (newQty < 1) return;

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/cart/update_quantity/',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            newQty,
          }),
        },
      );
      if (response.status === 200) {
        const updated = await fetch(
          `http://127.0.0.1:8000/api/cart/${userId}/`,
        );

        const data = await updated.json();

        setCartItems(data);
        const total = data.reduce(
          (sum, item) => sum + item.food.item_price * item.quantity,
          0,
        );
        setGrandTotal(total);
      }
    } catch (error) {
      toast.error('An error occurred while adding item to cart');
    }
  };

  const deleteCartItem = async (orderId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this item from the cart?',
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/cart/delete/${orderId}/`,
        {
          method: 'DELETE',
        },
      );
      if (response.status === 200) {
        const updated = await fetch(
          `http://127.0.0.1:8000/api/cart/${userId}/`,
        );

        const data = await updated.json();

        setCartItems(data);
        const total = data.reduce(
          (sum, item) => sum + item.food.item_price * item.quantity,
          0,
        );
        setGrandTotal(total);
        setCartCount(data.length);
      }
    } catch (error) {
      toast.error('Somethings went wrong');
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="container py-5 text-primary">
        <h2 className="mb-4 text-center">
          <FaShoppingCart className="me-2 " /> Your Cart
        </h2>
        {cartItems.length === 0 ? (
          <p className="text-center text-muted">Your cart is empty</p>
        ) : (
          <>
            <div className="row">
              {cartItems.map((item) => (
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <div className="row">
                      <div className="col-md-4">
                        <img
                          src={`http://127.0.0.1:8000${item.food.image}`}
                          className="img-fluid rounded-start"
                          style={{ minHeight: '200px', objectFit: 'cover' }}
                          alt=""
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{item.food.item_name}</h5>
                          <p className="card-text text-muted small">
                            {item.food.item_description}
                          </p>
                          <p className="fw-bold text-success">
                            ETB {item.food.item_price}
                          </p>
                          <div className="d-flex align-content-center mb-2">
                            <button
                              className=" btn btn-sm btn-outline-secondary me-2"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <FaMinus />
                            </button>
                            <span className="fw-bold px-2">
                              {' '}
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className=" btn btn-sm btn-outline-secondary ms-2"
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <button
                            onClick={() => deleteCartItem(item.id)}
                            className=" btn btn-sm btn-outline-danger px-3"
                          >
                            <FaTrash className="me-2" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-4 mt-4 shadow-sm border-0">
              <h4 className="text-end">Total: ETB {grandTotal.toFixed(2)}</h4>
              <div className="text-end">
                <button
                  className="btn btn-primary mt-3 px-4 py-2"
                  onClick={() => navigate('/payment')}
                >
                  <FaShoppingCart className="me-2" /> Proceed to Payment
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default Cart;
