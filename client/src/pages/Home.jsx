// client/src/pages/Home.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if accessToken exists in localStorage
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // If not logged in, redirect to /signin
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Redirect to Sign In
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6 text-green-700">
        You are successfully logged in!
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Log Out
      </button>
    </div>
  );
};

export default Home;
