import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNumber: "",
    gender: "Male",
    DOB: "1990-01-01",
    provider: "system"
  });

  // -------------------------
  // NORMAL SIGN UP (provider=system)
  // -------------------------
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        // If tokens are returned, store them
        if (data.tokens) {
          localStorage.setItem("accessToken", data.tokens.accessToken);
          localStorage.setItem("refreshToken", data.tokens.refreshToken);
        }
        navigate("/");
      } else {
        alert(data.message || "Sign Up failed");
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
    }
  };

  // -------------------------
  // GOOGLE SIGN UP
  // -------------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGoogleCredentialResponse = async (response) => {
    const idToken = response.credential;
    try {
      const result = await fetch("http://localhost:3000/users/google/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await result.json();
      if (result.ok) {
        if (data.tokens) {
          localStorage.setItem("accessToken", data.tokens.accessToken);
          localStorage.setItem("refreshToken", data.tokens.refreshToken);
        }
        navigate("/");
      } else {
        alert(data.message || "Google Sign Up failed");
      }
    } catch (error) {
      console.error("Google Sign Up Error:", error);
    }
  };

  // Initialize the Google button on mount
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleCredentialResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("googleSignUpDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, [handleGoogleCredentialResponse]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        {/* Normal Sign Up Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="1234567890"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Gender</label>
            <select
              name="gender"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Date of Birth</label>
            <input
              type="date"
              name="DOB"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.DOB}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded mb-4"
          >
            Sign Up
          </button>
        </form>

        {/* Google Sign Up Button */}
        <div className="w-full flex items-center justify-center my-2">
          <div id="googleSignUpDiv"></div>
        </div>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
