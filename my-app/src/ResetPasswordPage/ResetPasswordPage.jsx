import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const reset_token = searchParams.get("reset-token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!reset_token) {
        setMessage("Invalid or expired token!");
        setMessageType("error");
        setTimeout(() => navigate("/login"), 1500);
    }
    }, [reset_token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    try {
       const res = await fetch("http://localhost:3000/update-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + reset_token,
            },
            body: JSON.stringify({ newPassword }),
        });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Password changed successfully!");
        setMessageType("success");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.error || "Could not reset password!");
        setMessageType("error");
      }
    } catch {
      setMessage("Server error!");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl gap-5 p-12 flex flex-col items-center">
        <h2 className="text-2xl font-normal mb-2 text-center">Set New Password</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold text-gray-700">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-3 mb-6 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-800 text-white rounded-md font-bold text-lg transition"
          >
            Reset Password
          </button>
          {message && (
            <div
              className={`fixed left-1/2 top-8 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow font-poppins text-lg
                ${messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-300"
                  : "bg-red-50 text-red-700 border border-red-300"
                }
              `}
              style={{ minWidth: 300, maxWidth: 400, textAlign: "center" }}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;