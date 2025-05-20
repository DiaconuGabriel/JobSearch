import NavbarComponent from "./LandingPageComponents/NavbarComponent";
import CVdrop from "./LandingPageComponents/CVdrop";
import Filters from "./LandingPageComponents/Filters";

const LandingPage = () => {
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