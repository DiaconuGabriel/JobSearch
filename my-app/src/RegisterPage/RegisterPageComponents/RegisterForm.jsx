import { Link } from "react-router-dom";

const RegisterForm = () => {
  return (
    <div className="w-lg h-150 p-12 content-center rounded-2xl bg-white">
      <h2 className="text-center mb-1.5 text-3xl text-gray-900 font-poppins">Register</h2>
      <p className="text-center text-gray-500 mb-5 text-lg font-poppins">
        Create your account to get started!
      </p>
      <form>
        <label className="block mb-1 font-semibold text-gray-700 text-lg font-poppins">
          Name
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full p-3 mb-4 rounded-md border border-gray-400 text-l outline-none transition focus:border-blue-500 font-poppins"
        />
        <label className="block mb-2 font-semibold text-gray-700 text-lg font-poppins">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded-md border border-gray-400 text-l outline-none transition focus:border-blue-500 font-poppins"
        />
        <label className="block mb-2 font-semibold text-gray-700 text-lg font-poppins">
          Password
        </label>
        <input
          type="password"
          placeholder="Create a password"
          className="w-full p-3 mb-8 rounded-md text-l border border-gray-400 outline-none transition focus:border-blue-500 font-poppins"
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r bg-blue-600 hover:bg-blue-800 text-white border-none rounded-md font-bold text-lg cursor-pointer mb-4 font-poppins tracking-wide"
        >
          Register
        </button>
      </form>
      <div className="text-center text-base font-poppins">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 no-underline font-semibold font-poppins">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;