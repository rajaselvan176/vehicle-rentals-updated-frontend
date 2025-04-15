import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [modifying, setModifying] = useState(null);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5); // Default to 5 stars
  const [reviewedBookings, setReviewedBookings] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://vehicle-rentals-updated-backend.onrender.com/api/bookings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
        console.log("while loading Bookings Page", response.data);
        // Collect bookings that have already been reviewed
        const reviewedBookings = response.data.filter((booking) => booking.reviewStatus === true);
        setReviewedBookings(reviewedBookings.map((b) => b._id));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [userId, navigate, token]);

  const handleCancel = async (vehicleId, bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.delete(`https://vehicle-rentals-updated-backend.onrender.com/api/bookings/${vehicleId}/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  const handleModify = async (booking) => {
    if (!newStart || !newEnd) {
      alert("Please pick new dates.");
      return;
    }

    try {
      await axios.put(
        `https://vehicle-rentals-updated-backend.onrender.com/api/bookings/${booking.vehicle._id}/${booking._id}`,
        {
          startDate: newStart,
          endDate: newEnd,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModifying(null);
      const response = await axios.get(`https://vehicle-rentals-updated-backend.onrender.com/api/bookings/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error modifying booking:", error);
    }
  };

  // Handle Review submission
  const handleReviewSubmit = async (bookingId, vehicleId) => {
    if (!rating || !reviewText.trim()) {
      alert("Please provide both a rating and comment.");
      return;
    }
  
    try {
      const response = await axios.post(
        "https://vehicle-rentals-updated-backend.onrender.com/api/reviews",
        {
          vehicleId,
          bookingId,
          rating,
          comment: reviewText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviewedBookings((prev) => [...prev, bookingId]);
      setReviewText("");
      setRating(5); // Reset rating after submission
      alert(response.data.message);
    } catch (err) {
      console.error("Review error:", err);
      const msg = err?.response?.data?.message || "Failed to submit review.";
      alert(`❌ ${msg}`);
    }
  };
  

  // Function to handle star click for rating
  const handleStarClick = (ratingValue) => {
    setRating(ratingValue);
  };

  // Function to render stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleStarClick(i)}
          className={`cursor-pointer text-2xl ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">My Bookings</h1>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
              <img
                src={booking.vehicle.image || "https://via.placeholder.com/120"}
                alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                className="w-28 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold">
                  {booking.vehicle.make} {booking.vehicle.model}
                </h2>
                <p className="text-sm text-gray-600">
                  {new Date(booking.startDate).toLocaleDateString()} &rarr;{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-semibold">Total:</span> ${booking.totalPrice}
                </p>
                <p
                  className={`text-sm mt-1 font-medium ${
                    booking.status === "confirmed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {booking.status}
                </p>

                {/* Modify Section */}
                {/* Modify/Cancel Section (disabled after end date) */}
{(() => {
  const bookingEnded = new Date(booking.endDate) < new Date();

  if (modifying === booking._id) {
    return !bookingEnded ? (
      <div className="mt-2">
        <input
          type="date"
          value={newStart}
          onChange={(e) => setNewStart(e.target.value)}
          className="border p-1 mr-2"
        />
        <input
          type="date"
          value={newEnd}
          onChange={(e) => setNewEnd(e.target.value)}
          className="border p-1 mr-2"
        />
        <button
          onClick={() => handleModify(booking)}
          className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
        >
          Save
        </button>
        <button
          onClick={() => setModifying(null)}
          className="text-gray-600 underline"
        >
          Cancel
        </button>
      </div>
    ) : (
      <p className="mt-3 text-sm italic text-gray-500">
        Past Bookings
      </p>
    );
  } else {
    return !bookingEnded ? (
      <div className="mt-3 flex gap-3">
        <button
          onClick={() => setModifying(booking._id)}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Modify
        </button>
        <button
          onClick={() => handleCancel(booking.vehicle._id, booking._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    ) : (
      <p className="mt-3 text-sm italic text-gray-500">
        past bookings
      </p>
    );
  }
})()}

                {/* Review Section (Only after the booking ends and not reviewed yet) */}
                {new Date(booking.endDate) < new Date() && !reviewedBookings.includes(booking._id) && (
  <div className="mt-4 border-t pt-3">
    <p className="font-semibold mb-1">Leave a review:</p>

    <div className="flex gap-2 mb-2">{renderStars()}</div>

    <textarea
      placeholder="Write your review..."
      className="w-full border p-2 mb-2"
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
    ></textarea>

    <button
      onClick={() => handleReviewSubmit(booking._id, booking.vehicle._id)}
      className="bg-blue-600 text-white px-3 py-1 rounded"
    >
      Submit Review
    </button>
  </div>
)}

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          <p>No bookings found.</p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
