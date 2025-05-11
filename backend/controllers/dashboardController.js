const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel");

// @desc    Get vaccination report
// @route   GET /api/dashboard
// @access  Private
const getDashboard = asyncHandler(async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const vaccinatedStudents = await Student.countDocuments({
      vaccinations: { $exists: true, $not: { $size: 0 } },
    });

    const vaccinationCoverage =
      totalStudents > 0
        ? ((vaccinatedStudents / totalStudents) * 100).toFixed(1)
        : 0;

    res.json({
      totalStudents,
      vaccinatedStudents,
      vaccinationCoverage,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

module.exports = { getDashboard };
