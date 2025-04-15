// PaymentHistory.jsx
import React, { useEffect, useState } from 'react';

const PaymentHistory = ({ userId }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`/api/bookings/user/${userId}/payments`, {
          headers: {
            'Content-Type': 'application/json',
            // Include authorization token if needed
            // 'Authorization': `Bearer ${yourAuthToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        } else {
          console.error('Failed to fetch payment history');
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    fetchPayments();
  }, [userId]);

  return (
    <div>
      <h2>Your Payment History</h2>
      {payments.length > 0 ? (
        <ul>
          {payments.map((payment) => (
            <li key={payment.paymentIntentId}>
              <p>
                {payment.vehicle} - {new Date(payment.startDate).toLocaleDateString()} to{' '}
                {new Date(payment.endDate).toLocaleDateString()}
              </p>
              <p>Total Paid: ${payment.totalPrice}</p>
              <p>Status: {payment.status}</p>
              <a href={`/api/payment/invoice/${payment.paymentIntentId}`} download>
                Download Invoice
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No payment history found.</p>
      )}
    </div>
  );
};

export default PaymentHistory;
