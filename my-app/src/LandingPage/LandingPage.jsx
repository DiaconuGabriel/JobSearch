import NavbarComponent from "./LandingPageComponents/NavbarComponent";
import CVdrop from "./LandingPageComponents/CVdrop";
import Filters from "./LandingPageComponents/Filters";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LandingPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="bg-gray-50 pt-16">
      <NavbarComponent />
      <div className="flex flex-col p-6">
        <CVdrop /> 
      </div>
      <Filters />
    </div>
  );
};

export default LandingPage;