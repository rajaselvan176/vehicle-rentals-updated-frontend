import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the user session from localStorage
    console.log("clearing user id from local storage"+localStorage.getItem("userId"));
    localStorage.removeItem("userId");

    // Redirect to login page after logging out
    setTimeout(() => {
      navigate("/login");
    }, 2000); // Wait for 2 seconds before redirecting (optional)
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-xl font-semibold text-gray-800">Logging out...</h1>
        <p className="text-gray-500 mt-4">You will be redirected to the login page shortly.</p>
      </div>
    </div>
  );
};

export default Logout;
