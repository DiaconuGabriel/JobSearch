import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Login successful!");
        console.log(data.token);
        localStorage.setItem("token", data.token);
        setEmail("");
        setPassword("");
        navigate("/landing-page");
      } else {
        setMessage(data.error || "Login failed!");
      }
    } catch (err) {
      console.log(err);
      setMessage("Server error!");
    }
  };

  return (
    <div className="size-140 p-10 rounded-2xl content-center bg-white">
      <h2 className="text-center mt-2 mb-2 text-3xl text-gray-900 font-poppins">Log in</h2>
      <p className="text-center text-gray-500 mb-7 text-lg font-poppins">
        Welcome back! Please log in to continue!
      </p>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold text-gray-700 text-lg font-poppins">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-8 rounded-md border border-gray-400 text-l outline-none transition focus:border-blue-500 font-poppins"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none rounded-md font-bold text-lg cursor-pointer mb-4 font-poppins tracking-wide transition-all duration-300"
        >
          Log In
        </button>
        {message && (
          <div className="text-center text-red-600 font-poppins mb-2">
            {message}
          </div>
        )}
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