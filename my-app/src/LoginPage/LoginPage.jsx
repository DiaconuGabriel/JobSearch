import React from "react";
import LoginForm from "./LoginPageComponents/LoginForm";

const LoginPage = () => {
  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        bg-cover bg-center
        md:bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')]
        bg-white
      "
    >
      <LoginForm />
    </div>
  );
};

export default LoginPage;