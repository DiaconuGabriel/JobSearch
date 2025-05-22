import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    try {
      const res = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Recovery email sent!");
        setMessageType("success");
      } else {
        setMessage(data.error || "Could not send email!");
        setMessageType("error");
      }
    } catch {
      setMessage("Server error!");
      setMessageType("error");
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl p-12 flex flex-col items-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png"
        alt="Reset password"
        className="w-20 h- mb-4"
      />
      <h2 className="text-2xl font-normal mb-2 text-center">Reset password</h2>
      <p className="mb-6 text-gray-600 text-center">
        Enter your email address and we will send you a link with further instructions.
      </p>
      <form className="w-full" onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-6 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-800 text-white rounded-md font-bold text-lg transition"
        >
          Send recovery link
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
      <Link
        to="/login"
        className="mt-4 w-full inline-block"
      >
        <button
          type="button"
          className="w-full py-3 bg-white hover:bg-gray-300 text-blue-700 rounded-md font-semibold text-lg transition"
        >
          Return to Login
        </button>
      </Link>
    </div>
  );
};

export default ForgotPasswordForm;