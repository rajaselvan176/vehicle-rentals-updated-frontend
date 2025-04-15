import React, { useState } from "react";
import axios from "axios";

const BookingForm = ({ vehicle, userId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const handleBooking = async () => {
    try {
      const response = await axios.post("/api/bookings", {
        userId,
        vehicleId: vehicle._id,
        startDate,
        endDate,
        totalPrice: vehicle.pricePerDay * ((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)),
      });

      setMessage("Booking confirmed!");
    } catch (error) {
      setMessage("Error booking vehicle. Try another date.");
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold">Book {vehicle.make} {vehicle.model}</h3>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 block my-2"/>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 block my-2"/>
      <button onClick={handleBooking} className="bg-blue-500 text-white p-2 rounded">Confirm Booking</button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default BookingForm;
