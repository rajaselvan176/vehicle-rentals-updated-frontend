import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import VehicleList from "./pages/VehicleList";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  // Update the state whenever the `userId` in localStorage changes
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("useEffect in App jsx called", storedUserId);
    setUserId(storedUserId);  // Update state when localStorage changes
  },[]); 
  // }, [localStorage.getItem("userId")]);  // This will listen for changes

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null); // Update state to null on logout
  };

  return (
    <BrowserRouter>
      <Navbar userId={userId} onLogout={handleLogout} /> {/* Pass userId to Navbar */}
      <Routes>
        <Route path="/" element={userId ? <VehicleList userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/bookings" element={userId ? <MyBookings userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/login"element={<Login setUserId={setUserId} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
