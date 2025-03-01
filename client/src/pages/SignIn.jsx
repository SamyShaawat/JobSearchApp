// client/src/pages/SignIn.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  // -------------------------
  // NORMAL SIGN IN
  // -------------------------
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.tokens) {
          localStorage.setItem("accessToken", data.tokens.accessToken);
          localStorage.setItem("refreshToken", data.tokens.refreshToken);
        }
        navigate("/");
      } else {
        alert(data.message || "Sign In failed");
      }
    } catch (error) {
      console.error("Sign In Error:", error);
    }
  };

  // -------------------------
  // GOOGLE SIGN IN
  // -------------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGoogleCredentialResponse = async (response) => {
    const idToken = response.credential;
    try {
      const result = await fetch("http://localhost:3000/users/google/signin", {
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
        alert(data.message || "Google Sign In failed");
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleCredentialResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, [handleGoogleCredentialResponse]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Members Log in</h2>
        
        {/* Normal Sign In Form */}
        <form onSubmit={handleSubmit}>
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
          <div className="mb-6">
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

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded mb-4"
          >
            Log In
          </button>
        </form>

        {/* Google Sign In Button */}
        <div className="w-full flex items-center justify-center my-2">
          <div id="googleSignInDiv"></div>
        </div>

        <p className="text-center mt-4">
          New here?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
