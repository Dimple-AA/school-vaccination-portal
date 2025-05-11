import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="ui secondary menu" style={{ padding: "1rem 2rem" }}>
      <div
        className="header item"
        style={{ fontSize: "2rem", fontWeight: "bold", color: "#333" }}
      >
        School Vaccination Portal
      </div>

      <div className="right menu">
        <button
          onClick={handleLogout}
          className="ui red button"
          style={{ marginRight: "10px", marginTop: "10px" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
