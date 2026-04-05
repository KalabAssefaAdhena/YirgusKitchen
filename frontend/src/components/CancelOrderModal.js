import React, { useState } from 'react';

const CancelOrderModal = ({
  show,
  handleCloseModal,
  orderNumber,
  paymentMode,
}) => {
  const [remark, setRemark] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!remark.trim()) {
      setError('Please probide a reason for cancellation');
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/cancel_order/${orderNumber}/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ remark }),
        },
      );
      const result = await response.json();
      if (response.ok) {
        let msg = result.message;
        if (paymentMode === 'online') {
          msg +=
            '\nSince you paid online, your amount will be refunded to your account in 2 days';
        }
        setMessage(msg);
        setRemark('');
        setError('');
      } else {
        setError(result.message || 'Failded to cancel order');
      }
    } catch (err) {
      console.error('Error :', err);
    }
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabindex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cancelled Order #{orderNumber}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            {message ? (
              <div className="alert alert-success">{message}</div>
            ) : (
              <>
                <label className="form-label">Reason for cancellation</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter reason here..."
                >
                  error && <div className="text-danger mt-2">{error}</div>
                </textarea>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-danger"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
