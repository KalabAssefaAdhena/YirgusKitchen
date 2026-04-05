import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = () => {
  const userId = localStorage.getItem('userId');
  const [paymentMode, setPaymentMode] = useState('');
  const [address, setAddress] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (paymentMode === 'online') {
      const { cardNumber, expiry, cvv } = cardDetails;

      if (!cardNumber || !expiry || !cvv) {
        toast.error('Please fill in all card details');
        return;
      }
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/place_order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          address,
          paymentMode,
          cardNumber: paymentMode === 'online' ? cardDetails.cardNumber : '',
          expiry: paymentMode === 'online' ? cardDetails.expiry : '',
          cvv: paymentMode === 'online' ? cardDetails.cvv : '',
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        toast.success(data.message);
        setTimeout(() => {
          navigate('/my-orders');
        }, 2000);
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('An error occurred while placing order.');
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <h3 className="text-center text-primary mb-4">
          <i className="fas fa-credit-card me-2"></i> Checkout & Payment
        </h3>
        <div className="card p-4 shadow-sm">
          <div className="mb-3">
            <label className="form-lable fw-semibold">Delivery Address</label>
            <textarea
              className="form-control border-primary-subtle "
              rows={3}
              placeholder="Enter your full delivery address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMode"
              value="cod"
              id="cod"
              required
              checked={paymentMode === 'cod'}
              onChange={(e) => setPaymentMode('cod')}
            />
            <label htmlFor="cod" className="form-check-lable ">
              Cash on Delivery
            </label>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMode"
              value="online"
              required
              id="online"
              checked={paymentMode === 'online'}
              onChange={() => setPaymentMode('online')}
            />
            <label htmlFor="online" className="form-check-lable ">
              Online Payment
            </label>
          </div>
          {paymentMode === 'online' && (
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Card Number</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="1234 **** **** ****"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      cardNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Expiry</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      expiry: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">CVV</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="****"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <button
            className="btn btn-success mt-4 w-100"
            onClick={handlePlaceOrder}
          >
            <i className="fa fa-check-circle me-2"></i>Confirm & Place Order
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Payment;
