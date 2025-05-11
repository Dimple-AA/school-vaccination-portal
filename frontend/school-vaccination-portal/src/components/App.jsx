import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Header from "./Header";
import AddStudent from "./AddStudent";
import StudentList from "./StudentList";
import StudentDetail from "./StudentDetail";
import api from "../api/students";
import "./App.css";
import EditStudent from "./EditStudent";
import BulkUpload from "./BulkUpload";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";
import ReportPage from "./ReportPage";
import ManageDrives from "./ManageDrives"; // ✅ NEW

function AppLayout({
  isAuthenticated,
  setIsAuthenticated,
  students,
  setStudents,
  searchTerm,
  searchResults,
  removeStudentHandler,
  searchHandler,
  addStudentHandler,
  updateStudentHandler,
  refreshStudentList,
}) {
  const location = useLocation();

  return (
    <>
      {isAuthenticated && location.pathname !== "/login" && (
        <Header
          onLogout={() => {
            localStorage.removeItem("authToken");
            setIsAuthenticated(false);
          }}
        />
      )}
      <Routes>
        <Route
          path="/login"
          element={<AuthForm onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <StudentList
                students={searchTerm.length < 1 ? students : searchResults}
                setStudents={setStudents}
                getStudentId={removeStudentHandler}
                term={searchTerm}
                searchKeyword={searchHandler}
                refreshStudents={refreshStudentList}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/add"
          element={
            isAuthenticated ? (
              <AddStudent addStudentHandler={addStudentHandler} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/edit"
          element={
            isAuthenticated ? (
              <EditStudent updateStudentHandler={updateStudentHandler} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/bulk-upload"
          element={
            isAuthenticated ? (
              <BulkUpload onUploadSuccess={refreshStudentList} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/student/:id"
          element={
            isAuthenticated ? <StudentDetail /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated ? <ReportPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/manage-drives"
          element={
            isAuthenticated ? (
              <ManageDrives />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const retrievedStudents = async (token) => {
    try {
      const response = await api.get("/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  const addStudentHandler = async (student) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found. Please log in.");
      return;
    }
    const request = {
      grade: 10,
      ...student,
    };
    const response = await api.post("/api/students", request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setStudents([...students, response.data]);
  };

  const updateStudentHandler = async (student) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found. Please log in.");
      return;
    }
    const response = await api.put(`/api/students/${student.ID}`, student, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { ID } = response.data;
    setStudents(students.map((s) => (s.ID === ID ? response.data : s)));
  };

  const removeStudentHandler = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found. Please log in.");
      return;
    }
    await api.delete(`/api/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newStudentList = students.filter((s) => s.ID !== id);
    setStudents(newStudentList);
  };

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const filtered = students.filter((s) =>
        Object.values(s)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(students);
    }
  };

  const refreshStudentList = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found. Please log in.");
      return;
    }
    const allStudents = await retrievedStudents(token);
    if (allStudents) setStudents(allStudents);
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsAuthenticated(true);
        const allStudents = await retrievedStudents(token);
        if (allStudents) setStudents(allStudents);
      }
    };
    init();
  }, []);

  return (
    <div className="ui container">
      <Router>
        <AppLayout
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          students={students}
          setStudents={setStudents}
          searchTerm={searchTerm}
          searchResults={searchResults}
          removeStudentHandler={removeStudentHandler}
          searchHandler={searchHandler}
          addStudentHandler={addStudentHandler}
          updateStudentHandler={updateStudentHandler}
          refreshStudentList={refreshStudentList}
        />
      </Router>
    </div>
  );
}

export default App;
