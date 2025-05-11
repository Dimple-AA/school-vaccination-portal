import React from "react";
import { Link } from "react-router-dom";

function StudentCard(props) {
  const { ID, name, email, grade, vaccinations = [] } = props.student;

  return (
    <div style={cardContainer}>
      <div style={cardLeft}>
        <Link
          to={`/student/${ID}`}
          state={{ student: props.student }}
          style={linkStyle}
        >
          <div style={nameStyle}>{name}</div>
          <div style={emailStyle}>{email}</div>
          <div style={gradeStyle}>Grade: {grade}</div>
        </Link>

        <div style={vaccinationBox}>
          {vaccinations.length > 0 ? (
            <ul style={vaccinationList}>
              {vaccinations.map((v, index) => (
                <li key={index}>
                  <strong>{v.vaccineName}</strong> –{" "}
                  {new Date(v.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p style={noVaccineText}>Not vaccinated</p>
          )}
        </div>
      </div>

      <div style={cardRight}>
        <button onClick={props.onVaccinate} style={vaccinateBtn}>
          💉 Vaccinate
        </button>

        <Link to={`/edit`} state={{ student: props.student }}>
          <i className="edit icon" style={iconStyleBlue}></i>
        </Link>

        <i
          className="trash icon"
          style={iconStyleRed}
          onClick={() => props.clickHandler(ID)}
        ></i>
      </div>
    </div>
  );
}

export default StudentCard;

const cardContainer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "16px",
  marginBottom: "12px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
};

const cardLeft = {
  flex: 1,
};

const cardRight = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "8px",
};

const nameStyle = {
  fontWeight: "bold",
  fontSize: "1.1rem",
  color: "#333",
};

const emailStyle = {
  fontSize: "0.95rem",
  color: "#666",
};

const gradeStyle = {
  fontSize: "0.9rem",
  color: "#444",
  marginTop: "2px",
};

const vaccinationBox = {
  marginTop: "8px",
  fontSize: "0.9rem",
  backgroundColor: "#f9f9f9",
  padding: "10px",
  borderRadius: "6px",
};

const vaccinationList = {
  listStyle: "disc",
  paddingLeft: "20px",
  margin: 0,
};

const noVaccineText = {
  fontStyle: "italic",
  color: "#999",
  margin: 0,
};

const vaccinateBtn = {
  backgroundColor: "#21ba45",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: "bold",
  transition: "background-color 0.2s",
};

const iconStyleBlue = {
  color: "#2185d0",
  fontSize: "1.2rem",
  cursor: "pointer",
};

const iconStyleRed = {
  color: "#db2828",
  fontSize: "1.2rem",
  cursor: "pointer",
};

const linkStyle = {
  textDecoration: "none",
};
