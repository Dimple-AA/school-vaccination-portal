import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddStudent(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const navigate = useNavigate();

  const add = (e) => {
    e.preventDefault();
    if (name === "" || email === "" || grade === "") {
      alert("All fields are mandatory");
      return;
    }
    props.addStudentHandler({ name, email, grade });
    setName("");
    setEmail("");
    setGrade("");
    navigate("/dashboard");
  };

  return (
    <div className="ui main">
      <h2>Add Student</h2>
      <form className="ui form" onSubmit={add}>
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="text"
            name="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Grade</label>
          <input
            type="text"
            name="grade"
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>
        <button className="ui button blue">Add</button>
      </form>
    </div>
  );
}

export default AddStudent;
