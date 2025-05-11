import React from "react";
import { Link, useLocation } from "react-router-dom";

function StudentDetail() {
  const location = useLocation();
  const student = location.state?.student;

  if (!student) {
    return <p style={{ color: "red" }}>No student data provided.</p>;
  }

  const { name, email, grade } = student;

  return (
    <div className="main">
      <div className="ui card centered">
        <div className="content">
          <div className="header">{name}</div>
          <div className="description">{email}</div>
          <div className="description">Grade: {grade}</div>{" "}
          {/* Display grade */}
        </div>
      </div>
      <div className="center-div">
        <Link to={"/"}>
          <button className="ui button blue center">
            Back to Student List
          </button>
        </Link>
      </div>
    </div>
  );
}

export default StudentDetail;
