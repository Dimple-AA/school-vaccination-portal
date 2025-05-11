import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/students";
import VaccinationForm from "./VaccinationForm";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    vaccinatedStudents: 0,
  });

  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedDrive, setSelectedDrive] = useState(null);
  const token = localStorage.getItem("authToken");

  const fetchUpcomingDrives = async () => {
    try {
      const res = await api.get("/api/vaccination", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);

      const filteredDrives = res.data.filter((drive) => {
        const startDate = new Date(drive.startDate);
        return startDate >= today && startDate <= thirtyDaysLater;
      });

      setUpcomingDrives(filteredDrives);
    } catch (err) {
      console.error("Failed to fetch vaccination drives", err);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchDashboardData();
    fetchUpcomingDrives();
  }, []);

  const percentage =
    metrics.totalStudents > 0
      ? ((metrics.vaccinatedStudents / metrics.totalStudents) * 100).toFixed(1)
      : 0;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard Overview</h2>
      <div style={{ marginBottom: "2rem" }}>
        <p>
          <strong>Total Students:</strong> {metrics.totalStudents}
        </p>
        <p>
          <strong>Vaccinated Students:</strong> {metrics.vaccinatedStudents}
        </p>
        <p>
          <strong>Vaccination Coverage:</strong> {percentage}%
        </p>
      </div>

      <h3 style={{ textAlign: "left", marginTop: "2rem" }}>
        Upcoming Vaccination Drives
      </h3>

      {upcomingDrives.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "2rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              {[
                "Drive Name",
                "Location",
                "Start Date",
                "End Date",
                "Vaccines Available",
                "Slots Available",
                "Grades Available",
              ].map((h) => (
                <th
                  key={h}
                  style={{ padding: "0.75rem", border: "1px solid #ccc" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {upcomingDrives.map((drive) => (
              <tr key={drive._id}>
                <td style={tdStyle}>{drive.driveName}</td>
                <td style={tdStyle}>{drive.location}</td>
                <td style={tdStyle}>
                  {new Date(drive.startDate).toLocaleDateString()}
                </td>
                <td style={tdStyle}>
                  {new Date(drive.endDate).toLocaleDateString()}
                </td>
                <td style={tdStyle}>{drive.vaccinesAvailable.join(", ")}</td>
                <td style={tdStyle}>{drive.slotsAvailable}</td>
                <td style={tdStyle}>
                  {drive.gradesAvailable?.join(", ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ fontStyle: "italic" }}>No upcoming drives.</p>
      )}

      {showForm && (
        <VaccinationForm
          mode={formMode}
          drive={selectedDrive}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchUpcomingDrives();
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Link to="/" className="ui button">
          View Students
        </Link>
        <Link to="/add" className="ui button">
          Add Student
        </Link>
        <Link to="/bulk-upload" className="ui button">
          Bulk Upload
        </Link>
        <Link to="/reports" className="ui button">
          View Reports
        </Link>
        <Link to="/manage-drives" className="ui button">
          Manage Drives
        </Link>
      </div>
    </div>
  );
}

const tdStyle = { padding: "0.75rem", border: "1px solid #ccc" };
