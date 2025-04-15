// PaymentComponent.jsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your-publishable-key-here'); // Replace with your Stripe publishable key

const PaymentComponent = ({ vehicle, startDate, endDate }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Call your backend to create a Checkout session
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicle,
          startDate,
          endDate,
        }),
      });
      const session = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

      if (error) {
        console.error('Stripe Checkout error:', error);
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Confirm Your Booking</h2>
      <p>
        {vehicle.make} {vehicle.model}
      </p>
      <p>
        {new Date(startDate).toLocaleDateString()} -{' '}
        {new Date(endDate).toLocaleDateString()}
      </p>
      <p>Total Price: ${vehicle.pricePerDay * ((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))}</p>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentComponent;
