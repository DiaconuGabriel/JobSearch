import NavbarComponent from "./LandingPageComponents/NavbarComponent";
import CVdrop from "./LandingPageComponents/CVdrop";

const LandingPage = () => {
  return (
    <div className="bg-gray-50">
      <NavbarComponent />
      <div className="flex flex-col p-23">
        <CVdrop /> 
      </div>
      </div>
  );
};

export default LandingPage;