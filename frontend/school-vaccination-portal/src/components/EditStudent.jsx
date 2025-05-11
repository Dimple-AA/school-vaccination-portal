import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EditStudent(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { ID, name, email, grade } = location.state.student;

  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [newGrade, setNewGrade] = useState(grade);

  const update = (e) => {
    e.preventDefault();
    if (newName === "" || newEmail === "" || newGrade === "") {
      alert("All fields are mandatory");
      return;
    }
    props.updateStudentHandler({
      ID,
      name: newName,
      email: newEmail,
      grade: newGrade,
    });
    setNewName("");
    setNewEmail("");
    setNewGrade("");
    navigate("/");
  };

  return (
    <div className="ui main">
      <h2>Edit Student</h2>
      <form className="ui form" onSubmit={update}>
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="text"
            name="email"
            placeholder="Email ID"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Grade</label>
          <input
            type="text"
            name="grade"
            placeholder="Grade"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
          />
        </div>
        <button className="ui button blue">Update</button>
      </form>
    </div>
  );
}

export default EditStudent;
