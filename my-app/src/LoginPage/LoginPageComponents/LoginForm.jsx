import React from "react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <div className="size-140 p-10 rounded-2xl content-center bg-white">
      <h2 className="text-center mt-2 mb-2 text-3xl text-gray-900 font-poppins">Log in</h2>
      <p className="text-center text-gray-500 mb-7 text-lg font-poppins">
        Welcome back! Please log in to continue!
      </p>
      <form>
        <label className="block mb-2 font-semibold text-gray-700 text-lg font-poppins">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-8 rounded-md border border-gray-400 text-l outline-none transition focus:border-blue-500 font-poppins"
        />
        <div className="flex mb-2 items-center justify-between">
          <label className="font-semibold text-gray-700 font-poppins text-lg">
            Password
          </label>
          <Link to="/forgot-password" className="text-s text-blue-600 font-medium no-underline font-poppins">
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-3 mb-8 rounded-md text-l border border-gray-400 outline-none transition focus:border-blue-500 font-poppins"
        />
        <Link
          to="/landing-page"
          className="w-full block text-center py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none rounded-md font-bold text-lg cursor-pointer mb-4 font-poppins tracking-wide transition-all duration-300"
        >
          Log In
        </Link>
      </form>
      <div className="text-center text-base font-poppins">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 no-underline font-semibold font-poppins">
          Register here!
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;