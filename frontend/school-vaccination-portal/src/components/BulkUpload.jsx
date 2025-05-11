import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/students";

function BulkUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No auth token found. Please log in.");
        return;
      }
      const res = await api.post("/api/students/bulk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(`Upload successful: ${res.data.count} students added.`);
      if (onUploadSuccess) {
        await onUploadSuccess();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Make sure the file format is correct.");
    }
  };

  return (
    <div className="ui segment">
      <h3>Bulk Upload Students</h3>
      <form className="ui form" onSubmit={handleUpload}>
        <div className="field">
          <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        </div>
        <button className="ui primary button" type="submit">
          Upload Excel
        </button>
      </form>
      {message && <div className="ui message">{message}</div>}
    </div>
  );
}

export default BulkUpload;
