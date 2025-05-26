import { useState, useEffect} from "react";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("https://jobsearch-n4zw.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registered successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.error || "Registration failed!");
      }
    } catch (err) {
      setMessage("Server error!");
    }
  };

  return (
    <div className="w-lg h-150 p-12 content-center rounded-2xl bg-white">
      <h2 className="text-center mb-1.5 text-3xl text-gray-900 font-poppins">
        Register
      </h2>
      <p className="text-center text-gray-500 mb-5 text-lg font-poppins">
        Create your account to get started!
      </p>
      <form onSubmit={handleSubmit}>
        <label className="block mb-1 font-semibold text-gray-700 text-lg font-poppins">
          Name
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full p-3 mb-4 rounded-md border border-gray-400 text-l outline-none transition focus:border-blue-500 font-poppins"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="block mb-2 font-semibold text-gray-700 text-lg font-poppins">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded-md border border-gray-400 text-l outline-none transition focus:border-blue-500 font-poppins"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="block mb-2 font-semibold text-gray-700 text-lg font-poppins">
          Password
        </label>
        <input
          type="password"
          placeholder="Create a password"
          className="w-full p-3 mb-8 rounded-md text-l border border-gray-400 outline-none transition focus:border-blue-500 font-poppins"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r bg-blue-600 hover:bg-blue-800 text-white border-none rounded-md font-bold text-lg cursor-pointer mb-4 font-poppins tracking-wide"
        >
          Register
        </button>
        {message && (
          <div
            className={`fixed left-1/2 top-8 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow font-poppins text-lg
              ${message === "Registered successfully!"
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
      <div className="text-center text-base font-poppins">
        Already have an account?{" "}
        <Link
          to="/login-page"
          className="text-blue-600 no-underline font-semibold font-poppins"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;