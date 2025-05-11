import React, { useEffect, useState } from "react";
import api from "../api/students";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [vaccineFilter, setVaccineFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [availableVaccines, setAvailableVaccines] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchReports();
  }, [page, vaccineFilter, gradeFilter, vaccinationDate]);

  const fetchReports = async () => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(vaccineFilter && { vaccine: vaccineFilter }),
        ...(gradeFilter && { grade: gradeFilter }),
        ...(vaccinationDate && { date: vaccinationDate }),
      });

      const res = await api.get(`/api/reports/vaccinations?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.students;
      setReports(data);
      setFilteredReports(data);
      setTotalPages(Math.ceil(res.data.total / limit));

      const vaccines = new Set();
      const grades = new Set();

      data.forEach((s) => {
        if (s.vaccineName) vaccines.add(s.vaccineName);
        if (s.grade) grades.add(s.grade);
      });

      setAvailableVaccines([...vaccines]);
      setAvailableGrades([...grades]);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredReports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vaccination Report");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "vaccination_report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Vaccination Report", 14, 16);

    autoTable(doc, {
      startY: 20,
      head: [["Name", "Grade", "Email", "Vaccine", "Date"]],
      body: filteredReports.map((s) => [
        s.name,
        s.grade,
        s.email,
        s.vaccineName,
        new Date(s.date).toLocaleDateString(),
      ]),
    });

    doc.save("vaccination_report.pdf");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Vaccination Reports</h2>

      <div
        style={{
          margin: "1rem 0",
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Vaccine Filter */}
        <div>
          <label>Vaccine:</label>
          <select
            value={vaccineFilter}
            onChange={(e) => {
              setVaccineFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            {availableVaccines.map((v, idx) => (
              <option key={idx} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Grade Filter */}
        <div>
          <label>Grade:</label>
          <select
            value={gradeFilter}
            onChange={(e) => {
              setGradeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            {availableGrades.map((g, idx) => (
              <option key={idx} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label>Date of Vaccination:</label>
          <input
            type="date"
            value={vaccinationDate}
            onChange={(e) => {
              setVaccinationDate(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            {["Name", "Grade", "Email", "Vaccine", "Date"].map((h, i) => (
              <th
                key={i}
                style={{ border: "1px solid #ccc", padding: "0.5rem" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((s, idx) => (
            <tr key={idx}>
              <td style={td}>{s.name}</td>
              <td style={td}>{s.grade}</td>
              <td style={td}>{s.email}</td>
              <td style={td}>{s.vaccineName}</td>
              <td style={td}>{new Date(s.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Downloads */}
      <div style={{ marginTop: "2rem" }}>
        <CSVLink data={filteredReports} filename="vaccination_report.csv">
          <button style={downloadButton}>CSV</button>
        </CSVLink>
        <button
          onClick={exportToExcel}
          style={{ ...downloadButton, backgroundColor: "#21ba45" }}
        >
          Excel
        </button>
        <button
          onClick={exportToPDF}
          style={{ ...downloadButton, backgroundColor: "#db2828" }}
        >
          PDF
        </button>
      </div>
    </div>
  );
}

const td = {
  padding: "0.5rem",
  border: "1px solid #ccc",
  textAlign: "left",
};

const downloadButton = {
  padding: "0.5rem 1rem",
  backgroundColor: "#2185d0",
  color: "white",
  border: "none",
  borderRadius: "5px",
  marginRight: "1rem",
};
