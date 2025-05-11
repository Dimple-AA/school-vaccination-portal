const mongoose = require("mongoose");

const vaccinationDriveSchema = mongoose.Schema(
  {
    vaccinationId: {
      type: String,
      required: [true, "Please add the vaccination ID"],
    },
    driveName: {
      type: String,
      required: [true, "Please add the drive name"],
    },
    location: {
      type: String,
      required: [true, "Please add the location"],
    },
    startDate: {
      type: Date,
      required: [true, "Please add the start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please add the end date"],
    },
    vaccinesAvailable: {
      type: [String],
      required: [true, "Please add the vaccines"],
    },
    slotsAvailable: {
      type: Number,
      required: [true, "Please add the slots available"],
    },
    gradesAvailable: {
      type: [String], // This will hold an array of grades, like ["Grade 1", "Grade 2"]
      required: [
        true,
        "Please specify the grades for which the drive is available",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VaccinationDrive", vaccinationDriveSchema);
