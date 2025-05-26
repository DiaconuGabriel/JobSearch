import { useState } from "react";

const locations = ["Remote","Romania","Europe","Austria","Belgium",
                  "Bulgaria","Croatia","Cyprus","Czech Republic",
                  "Denmark","Estonia","Finland","France","Germany",
                  "Greece","Hungary","Ireland","Italy","Latvia",
                  "Lithuania","Luxembourg","Malta","Netherlands",
                  "Poland","Portugal","Slovakia","Slovenia","Spain","Sweden"
];

const seniorityLevels = [
  "Junior",
  "Mid",
  "Senior",
];

const Filters = ({ onChange, onJobsFetched, setLoading }) => {
  const [location, setLocation] = useState("");
  const [seniority, setSeniority] = useState("");
  const [salary, setSalary] = useState("");
  const [error, setError] = useState("");

  const handleChange = () => {
    if (onChange) {
      onChange({ location, seniority, salary }); 
    }
  };

  const handleSearch = async () => {
    const params = {};
    if (location) params.location = location;
    if (seniority) params.seniority = seniority;
    if (salary) params.salary = parseInt(salary, 10);
    if (setLoading) setLoading(true);
    try {
      console.log("Searching with params:", params);
      const res = await fetch("http://localhost:3000/get-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error fetching jobs!");
        setTimeout(() => setError(""), 2000);
        return;
      }
      const data = await res.json();
      console.log("Its ok", res.ok);
      console.log("Jobs fetched:", data);
      onJobsFetched(data);
    } catch (err) {
      setError("Error fetching jobs!");
      setTimeout(() => setError(""), 2000);
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 bg-white rounded-xl p-6 shadow justify-center items-center">
      <div className="flex flex-col justify-start basis-48">
        <label className="block mb-1 font-semibold text-gray-700">Location</label>
        <select
          className="border rounded px-3 py-2 min-w-[130px] w-full"
          value={location}
          onChange={e => { setLocation(e.target.value); handleChange(); }}
        >
          <option value="">Select location</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col justify-start basis-48">
        <label className="block mb-1 font-semibold text-gray-700">Seniority level</label>
        <select
          className="border rounded px-3 py-2 min-w-[100px] w-full"
          value={seniority}
          onChange={e => { setSeniority(e.target.value); handleChange(); }}
        >
          <option value="">Any</option>
          {seniorityLevels.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col justify-start basis-48">
        <label className="block mb-1 font-semibold text-gray-700">Minimum Salary</label>
        <input
          type="number"
          min={0}
          className="border rounded px-3 py-2 w-full"
          placeholder="e.g. 4000"
          value={salary}
          onChange={e => { setSalary(e.target.value); handleChange(); }}
        />
      </div>
 
      <div className="flex flex-col justify-end basis-48">
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition w-full"
          onClick={handleSearch}
          type="button"
        >
          Search
        </button>
      </div>
      {error && (
        <div
          className={`fixed left-1/2 top-8 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow font-poppins text-lg
          bg-red-50 text-red-700 border border-red-300
        `}
          style={{ minWidth: 300, maxWidth: 400, textAlign: "center" }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default Filters;