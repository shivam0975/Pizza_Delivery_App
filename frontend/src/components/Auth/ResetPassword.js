//This module provides a user to reset their password

import React, { useState } from "react";
import axios from "../../utils/api";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || "Password reset successful.");
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="bg-gray-900 relative top-80 text-white flex items-center justify-center">
      <form
        onSubmit={handleReset}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {message && <div className="text-green-400 text-sm mb-4 text-center">{message}</div>}
        {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
