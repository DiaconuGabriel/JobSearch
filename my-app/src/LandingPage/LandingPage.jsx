import NavbarComponent from "./LandingPageComponents/NavbarComponent";
import CVdrop from "./LandingPageComponents/CVdrop";
import Filters from "./LandingPageComponents/Filters";
import Jobs from "./LandingPageComponents/Jobs";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const LandingPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [jobs, setJobs] = useState([]);
  const [keywordsObj, setKeywordsObj] = useState({});
  const [seniorityKeywordsObj, setSeniorityKeywordsObj] = useState({});

  const handleJobsFetched = (data) => {
    setJobs(data.jobs || []);
    setKeywordsObj(data.keywordsObj || {});
    setSeniorityKeywordsObj(data.seniorityKeywordsObj || {});
  };

  return (
    <div className="bg-gray-50 pt-16">
      <NavbarComponent />
      <div className="flex flex-col p-6">
        <CVdrop /> 
      </div>
      <Filters onJobsFetched={handleJobsFetched}/>
      <Jobs
        jobs={jobs}
        keywordsObj={keywordsObj}
        seniorityKeywordsObj={seniorityKeywordsObj}
      />
    </div>
  );
};

export default LandingPage;