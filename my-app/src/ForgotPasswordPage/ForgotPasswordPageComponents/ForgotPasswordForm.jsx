import React from "react";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl p-12 flex flex-col items-center">
      {/* Imagine sugestivă pentru resetare parolă */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png"
        alt="Reset password"
        className="w-20 h- mb-4"
      />
      <h2 className="text-2xl font-normal mb-2 text-center">Reset password</h2>
      <p className="mb-6 text-gray-600 text-center">
        Enter your email address and we will send you a link with further instructions.
      </p>
      <form className="w-full">
        <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-6 rounded-md border border-gray-300 outline-none focus:border-blue-500 transition"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-800 text-white rounded-md font-bold text-lg transition"
        >
          Send recovery link
        </button>
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