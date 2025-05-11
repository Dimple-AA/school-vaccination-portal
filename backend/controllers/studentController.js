const { v4: uuidv4 } = require("uuid");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel");

//@desc Get all student details
//@route GET /api/students
//@access private
const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({ user_id: req.user.id });
  res.status(200).send(students);
});

//@desc Get a single student details
//@route GET /api/students/:studentId
//@access private
const getSingleStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ ID: req.params.studentId });
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  if (student.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to view other user students");
  }
  res.status(200).send(student);
});

//@desc Create student
//@route POST /api/students
//@access private
const createStudents = asyncHandler(async (req, res) => {
  const { name, grade, ID, email } = req.body;
  if (!name || !grade || !email) {
    res.status(400);
    throw new Error("All fields are mandatory ");
  }
  const student = await Student.create({
    name: name,
    grade: grade,
    ID: uuidv4(),
    email: email,
    user_id: req.user.id,
  });
  res.status(201).send(student);
});

//@desc Create student bulk
//@route POST /api/students/bulk
//@access private
const createBulkStudent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.resolve(req.file.path);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data.length) {
      return res.status(400).json({ message: "Excel sheet is empty" });
    }

    const studentsToInsert = data.map((row) => ({
      ID: uuidv4(),
      name: row.name,
      grade: row.grade,
      email: row.email,
      user_id: req.user.id,
    }));

    const createdStudents = await Student.insertMany(studentsToInsert);

    fs.unlinkSync(filePath);

    res.status(201).json({
      message: "Students uploaded successfully",
      count: createdStudents.length,
      students: createdStudents,
    });
  } catch (error) {
    console.error("Error reading/parsing Excel:", error);
    res
      .status(500)
      .json({ message: "Failed to process file", error: error.message });
  }
};

//@desc Update student
//@route PUT /api/students/:studentId
//@access private
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ ID: req.params.studentId });
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  if (student.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user students");
  }
  const updatedStudent = await Student.findOneAndUpdate(
    { ID: req.params.studentId },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).send(updatedStudent);
});

//@desc Delete student
//@route DELETE /api/students/:studentId
//@access private
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ ID: req.params.studentId });
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  if (student.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other user students");
  }

  await Student.deleteOne({ ID: req.params.studentId });
  res.status(200).send(student);
});

//@desc create vaccination status for student
//@route POST /api/:studentId/vaccinate
//@access private
const vaccinateStudent = asyncHandler(async (req, res) => {
  const { vaccineName, date } = req.body;
  const student = await Student.findOne({ ID: req.params.studentId });

  if (!student) return res.status(404).json({ message: "Student not found" });

  const alreadyVaccinated = student.vaccinations.some(
    (v) => v.vaccineName === vaccineName
  );

  if (alreadyVaccinated) {
    return res
      .status(400)
      .json({ message: "Already vaccinated for this vaccine" });
  }

  student.vaccinations.push({ vaccineName, date });
  await student.save();
  res.status(200).json({ message: "Vaccination recorded successfully" });
});

module.exports = {
  getStudents,
  getSingleStudent,
  createStudents,
  createBulkStudent,
  updateStudent,
  deleteStudent,
  vaccinateStudent,
};
