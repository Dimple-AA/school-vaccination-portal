import React, { useEffect, useState } from "react";
import api from "../api/students";
import VaccinationForm from "./VaccinationForm";

export default function ManageDrives() {
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
      setUpcomingDrives(res.data);
    } catch (err) {
      console.error("Failed to fetch vaccination drives", err);
    }
  };

  useEffect(() => {
    fetchUpcomingDrives();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this drive?")) return;
    try {
      await api.delete(`/api/vaccination/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUpcomingDrives();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Manage Vaccination Drives</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => {
            setFormMode("add");
            setSelectedDrive(null);
            setShowForm(true);
          }}
          style={buttonStyle}
        >
          Add Drive
        </button>
      </div>

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
                "Actions",
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
            {upcomingDrives.map((drive) => {
              const isPastDrive = new Date(drive.endDate) < new Date();
              return (
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
                  <td style={tdStyle}>{drive.gradesAvailable.join(", ")}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => {
                        setSelectedDrive(drive);
                        setFormMode("edit");
                        setShowForm(true);
                      }}
                      style={{
                        ...buttonStyle,
                        marginRight: "0.5rem",
                        backgroundColor: isPastDrive ? "#ccc" : "#e0e0e0",
                        cursor: isPastDrive ? "not-allowed" : "pointer",
                      }}
                      disabled={isPastDrive}
                      title={
                        isPastDrive ? "Cannot edit past drives" : "Edit drive"
                      }
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(drive.vaccinationId)}
                      style={buttonStyle}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
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
    </div>
  );
}

const tdStyle = { padding: "0.75rem", border: "1px solid #ccc" };

const buttonStyle = {
  backgroundColor: "#e0e0e0",
  color: "#333",
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.95rem",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};
