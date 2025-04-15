import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ userId, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("clearing user id from local storage inside NavBar" + localStorage.getItem("userId"));
    localStorage.removeItem("userId"); // Remove userId from localStorage
    onLogout(); // Call the onLogout function passed from App to update state
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-blue-200">Vehicle Rental</Link>
        </div>

        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/bookings" className="hover:text-blue-200">My Bookings</Link>

          {userId ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
            >
              Logout
            </button>
          ) : (
            <>
              {/* <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="hover:text-blue-200">Register</Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
