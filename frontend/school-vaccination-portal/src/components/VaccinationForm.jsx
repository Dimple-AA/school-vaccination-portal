import React, { useState, useEffect } from "react";
import api from "../api/students";

export default function VaccinationForm({ mode, drive, onClose, onSuccess }) {
  const isEdit = mode === "edit";
  const [existingDrives, setExistingDrives] = useState([]);
  const [formData, setFormData] = useState({
    driveName: drive?.driveName || "",
    location: drive?.location || "",
    startDate: drive?.startDate?.split("T")[0] || "",
    endDate: drive?.endDate?.split("T")[0] || "",
    vaccinesAvailable: drive?.vaccinesAvailable?.join(", ") || "",
    slotsAvailable: drive?.slotsAvailable || 0,
    gradesAvailable: drive?.gradesAvailable?.join(", ") || "", // Added gradesAvailable
  });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchExistingDrives = async () => {
      try {
        const res = await api.get("/api/vaccination", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the start of the day

        // Get the date 30 days from today
        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(today.getDate() + 30);

        // Filter drives within the next 30 days
        const upcomingDrives = res.data.filter((d) => {
          const driveStartDate = new Date(d.startDate);
          return driveStartDate >= today && driveStartDate <= thirtyDaysLater;
        });

        setExistingDrives(upcomingDrives);
      } catch (err) {
        console.error("Error fetching existing drives", err);
      }
    };

    fetchExistingDrives();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minStartDate = new Date(today);
    minStartDate.setDate(minStartDate.getDate() + 15);

    // 15-day advance scheduling
    if (start < minStartDate) {
      alert("Start date must be at least 15 days from today.");
      return;
    }

    // Prevent editing past/completed drives
    if (isEdit && new Date(drive.endDate) < today) {
      alert("Cannot edit past or completed drives.");
      return;
    }

    // Check for overlapping drives
    const overlaps = existingDrives.some((d) => {
      if (isEdit && d._id === drive._id) return false;

      const dStart = new Date(d.startDate);
      const dEnd = new Date(d.endDate);

      return (
        (start >= dStart && start <= dEnd) ||
        (end >= dStart && end <= dEnd) ||
        (start <= dStart && end >= dEnd)
      );
    });

    if (overlaps) {
      alert("Drive dates overlap with an existing vaccination drive.");
      return;
    }

    const payload = {
      ...formData,
      vaccinesAvailable: formData.vaccinesAvailable
        .split(",")
        .map((v) => v.trim()),
      gradesAvailable: formData.gradesAvailable.split(",").map((g) => g.trim()), // Convert grades into an array
    };

    try {
      if (isEdit) {
        await api.put(`/api/vaccination/${drive.vaccinationId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/api/vaccination", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save vaccination drive", err);
    }
  };

  return (
    <div style={modalStyle}>
      <div style={formContainerStyle}>
        <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
          {isEdit ? "Edit" : "Add"} Vaccination Drive
        </h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldGrid}>
            <label>Drive Name</label>
            <input
              type="text"
              name="driveName"
              value={formData.driveName}
              onChange={handleChange}
              required
            />

            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]} // Prevent past date selection
            />

            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              min={formData.startDate} // Ensure end date is after the start date
            />

            <label>Slots Available</label>
            <input
              type="number"
              name="slotsAvailable"
              value={formData.slotsAvailable}
              onChange={handleChange}
              required
            />

            <label>Vaccines (comma-separated)</label>
            <input
              type="text"
              name="vaccinesAvailable"
              value={formData.vaccinesAvailable}
              onChange={handleChange}
              required
            />

            <label>Grades Available (comma-separated)</label>
            <input
              type="text"
              name="gradesAvailable"
              value={formData.gradesAvailable}
              onChange={handleChange}
              required
            />
          </div>

          <div style={buttonRowStyle}>
            <button
              type="submit"
              style={{
                ...primaryBtn,
                backgroundColor: isEdit ? "#f2711c" : "#21ba45",
              }}
            >
              {isEdit ? "Update" : "Create"}
            </button>
            <button type="button" onClick={onClose} style={secondaryBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const formContainerStyle = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "10px",
  width: "100%",
  maxWidth: "500px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const fieldGrid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  rowGap: "0.8rem",
};

const buttonRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "1rem",
  marginTop: "1.5rem",
};

const primaryBtn = {
  color: "white",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const secondaryBtn = {
  backgroundColor: "#e0e1e2",
  color: "#333",
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};
