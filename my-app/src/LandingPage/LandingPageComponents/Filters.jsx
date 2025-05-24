import { useState } from "react";

const locations = [
  "Remote",
  "Romania",
  "Europe",
];

const radiusOptions = [
  { label: "5 km", value: 5 },
  { label: "10 km", value: 10 },
  { label: "25 km", value: 25 },
  { label: "50 km", value: 50 },
  { label: "100 km", value: 100 },
];

const Filters = ({ onChange, onJobsFetched}) => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("");
  const [salary, setSalary] = useState("");
  const [match, setMatch] = useState("");
  const [error, setError] = useState("");

  const handleChange = () => {
    if (onChange) {
      onChange({ location, radius, salary, match });
    }
  };

  const handleSearch = async () => {
    const params = {};
    if (location) params.location = location;
    if (radius) params.radius = String(radius);
    if (salary) params.salary = parseInt(salary, 10);
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
        <label className="block mb-1 font-semibold text-gray-700">Radius (km)</label>
        <select
          className="border rounded px-3 py-2 min-w-[100px] w-full"
          value={radius}
          onChange={e => { setRadius(e.target.value); handleChange(); }}
        >
          <option value="">Any</option>
          {radiusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
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

      <div className="flex flex-col justify-start basis-48">
        <label className="block mb-1 font-semibold text-gray-700 text-left">Minimum Match (%)</label>
        <select
          className="border rounded px-3 py-2 w-full text-left"
          value={match}
          onChange={e => {
            setMatch(e.target.value);
            handleChange();
          }}
        >
          <option value=""></option>
          {[...Array(8)].map((_, i) => {
            const val = 50 + i * 5;
            return (
              <option key={val} value={val}>{val}%</option>
            );
          })}
        </select>
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