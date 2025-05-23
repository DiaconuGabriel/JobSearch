import React, { useEffect } from "react";
import RegisterForm from "./RegisterPageComponents/RegisterForm";
import About from "./RegisterPageComponents/About";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        fetch("http://localhost:3000/validate-token", {
          headers: { Authorization: "Bearer " + token },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.valid) {
              navigate("/landing-page", { replace: true });
            } else {
              localStorage.removeItem("token");
            }
          })
          .catch(() => {
            localStorage.removeItem("token");
          });
      }
    }, [navigate]);

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        bg-cover bg-center
        md:bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')]
        bg-white
      "
    >
      <div className="flex flex-row items-center justify-center w-full max-w-5xl mx-16 gap-12 p-7">
        <div className="hidden md:block">
          <About />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;