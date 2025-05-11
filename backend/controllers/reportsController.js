const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel");

// @desc    Get vaccination report
// @route   GET /api/reports/vaccinations
// @access  Private
const getReports = asyncHandler(async (req, res) => {
  const { vaccine, grade, date, page = 1, limit = 10 } = req.query;

  // Build match stage dynamically
  const matchStage = {};
  if (vaccine) matchStage["vaccinations.vaccineName"] = vaccine;
  if (grade) matchStage["grade"] = grade;
  if (date) {
    // Match only date part (ignore time) using ISO string range
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    matchStage["vaccinations.date"] = { $gte: dayStart, $lte: dayEnd };
  }

  const students = await Student.aggregate([
    { $unwind: "$vaccinations" },
    { $match: matchStage },
    {
      $project: {
        name: 1,
        grade: 1,
        email: 1,
        vaccineName: "$vaccinations.vaccineName",
        date: "$vaccinations.date",
      },
    },
    { $sort: { date: -1 } },
    { $skip: (parseInt(page) - 1) * parseInt(limit) },
    { $limit: parseInt(limit) },
  ]);

  const totalResult = await Student.aggregate([
    { $unwind: "$vaccinations" },
    { $match: matchStage },
    { $count: "total" },
  ]);

  const total = totalResult[0]?.total || 0;

  res.status(200).json({
    students,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
  });
});

module.exports = { getReports };
