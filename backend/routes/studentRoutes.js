const express = require("express");
const {
  getStudents,
  getSingleStudent,
  createStudents,
  createBulkStudent,
  updateStudent,
  deleteStudent,
  vaccinateStudent,
} = require("../controllers/studentController");
const validateToken = require("../middleware/validateTokenHandler");
const upload = require("../middleware/upload");

const studentRouter = express.Router();

studentRouter.use(validateToken);
studentRouter.route("/").get(getStudents).post(createStudents);
studentRouter
  .route("/:studentId")
  .get(getSingleStudent)
  .put(updateStudent)
  .delete(deleteStudent);
studentRouter.route("/bulk").post(upload.single("file"), createBulkStudent);
studentRouter.route("/:studentId/vaccinate").post(vaccinateStudent);

module.exports = studentRouter;
