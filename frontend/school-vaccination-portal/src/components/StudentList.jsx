import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import StudentCard from "./StudentCard";
import VaccinationModal from "./VaccinationModal";

function StudentList(props) {
  const inputEl = useRef("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const deleteStudentHandler = (id) => {
    props.getStudentId(id);
  };

  const getSearchTerm = () => {
    props.searchKeyword(inputEl.current.value);
  };

  const renderStudentList = props.students.map((student) => (
    <StudentCard
      student={student}
      clickHandler={deleteStudentHandler}
      onVaccinate={() => setSelectedStudent(student)}
      key={student.id}
    />
  ));

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Student List
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/add">
            <button style={buttonStyle}>Add Student</button>
          </Link>
          <Link to="/bulk-upload">
            <button style={buttonStyle}>Bulk Upload</button>
          </Link>
        </div>
      </h2>

      {/* Search Box */}
      <div
        className="ui fluid icon input"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <input
          ref={inputEl}
          type="text"
          placeholder="Search student"
          className="prompt"
          value={props.term}
          onChange={getSearchTerm}
          aria-label="Search Students"
        />
        <i className="search icon"></i>
      </div>

      {/* Student Cards */}
      <div
        className="ui celled list"
        style={{ borderTop: "1px solid #ccc", marginTop: "10px" }}
      >
        {renderStudentList.length > 0
          ? renderStudentList
          : "No Students Available"}
      </div>

      {/* Vaccination Modal */}
      {selectedStudent && (
        <VaccinationModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSuccess={() => {
            setSelectedStudent(null);
            props.refreshStudents();
          }}
        />
      )}
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#2185d0",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
};

export default StudentList;
