const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add the student name"],
    },
    grade: {
      type: Number,
      required: [true, "Please add the student grade"],
    },
    ID: {
      type: String,
      required: [true, "Please add the student ID"],
    },
    email: {
      type: String,
      required: [true, "Please add the email ID"],
    },
    vaccinations: [
      {
        vaccineName: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
