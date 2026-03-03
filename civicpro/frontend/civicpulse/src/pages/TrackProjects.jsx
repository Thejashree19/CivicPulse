import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TrackProjects.css"; // import CSS

const districts = [
  "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
  "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
  "Nagapattinam", "Namakkal", "Perambalur", "Pudukottai", "Ramanathapuram",
  "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi",
  "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
  "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar",
];

const TrackProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (district) params.district = district;
      if (status) params.status = status;

      const res = await axios.get("http://localhost:5500/api/projects", {
        params,
      });
      setProjects(res.data);
    } catch (err) {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [district,status]);

  return (
    <div className="track-projects-container">
      <h2>Track Projects</h2>

      <div className="filters">
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="filter-select"
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button onClick={fetchProjects} className="filter-button">
          Filter
        </button>
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && projects.length === 0 && <p>No projects found.</p>}

      {!loading && projects.length > 0 && (
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>District</th>
              <th>Municipality</th>
              <th>Status / Progress</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Budget (₹)</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.title || "-"}</td>
                <td>{p.district || "-"}</td>
                <td>{p.municipality || "-"}</td>
                <td>{p.status || "-"}</td>
                <td>
                  {p.start_date
                    ? new Date(p.start_date).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  {p.end_date ? new Date(p.end_date).toLocaleDateString() : "-"}
                </td>
                <td>{p.budget ? p.budget.toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrackProjects;
