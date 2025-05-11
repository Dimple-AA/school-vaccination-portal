import React, { useState } from "react";
import api from "../api/students";

export default function VaccinationModal({ student, onClose, onSuccess }) {
  const [vaccineName, setVaccineName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const token = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/api/students/${student.ID}/vaccinate`,
        { vaccineName, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        alert("Vaccination recorded successfully!");
        onSuccess(response.data);
      } else {
        alert("Unexpected response from server.");
      }
    } catch (err) {
      alert("Failed to vaccinate student.");
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h2 style={{ marginBottom: "1rem" }}>💉 Vaccinate {student.name}</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Vaccine Name</label>
            <input
              type="text"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={buttonRow}>
            <button type="submit" style={submitBtn}>
              Confirm
            </button>
            <button type="button" onClick={onClose} style={cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "10px",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "0.5rem",
  fontWeight: "bold",
};

const inputStyle = {
  padding: "0.6rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "1rem",
  marginTop: "1rem",
};

const submitBtn = {
  backgroundColor: "#21ba45",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "0.6rem 1.2rem",
  fontWeight: "bold",
  cursor: "pointer",
};

const cancelBtn = {
  backgroundColor: "#e0e1e2",
  color: "#333",
  border: "none",
  borderRadius: "6px",
  padding: "0.6rem 1.2rem",
  fontWeight: "bold",
  cursor: "pointer",
};
