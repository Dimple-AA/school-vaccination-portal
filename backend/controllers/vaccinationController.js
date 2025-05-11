const { v4: uuidv4 } = require("uuid");
const VaccinationDrive = require("../models/vaccinationDriveModel");
const asyncHandler = require("express-async-handler");

//@desc Get vaccination drive list
//@route GET /api/vaccination
//@access private
const getVaccinationDrive = asyncHandler(async (req, res) => {
  try {
    const allDrives = await VaccinationDrive.find().sort({ startDate: 1 });
    res.status(200).json(allDrives);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vaccination drives", error });
  }
});

//@desc Get single vaccination drive
//@route GET /api/vaccination/:vaccinationId
//@access private
const getSingleVaccinationDrive = asyncHandler(async (req, res) => {
  try {
    const drive = await VaccinationDrive.findOne({
      vaccinationId: req.params.vaccinationId,
    });
    if (!drive) {
      return res.status(404).json({ message: "Vaccination Drive not found" });
    }
    res.status(200).json(drive);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vaccination drive", error });
  }
});

//@desc create a new vaccination drive
//@route POST /api/vaccination
//@access private
const createVaccinationDrive = asyncHandler(async (req, res) => {
  try {
    const {
      driveName,
      location,
      startDate,
      endDate,
      vaccinesAvailable,
      slotsAvailable,
      gradesAvailable, // Added gradesAvailable to request body
    } = req.body;

    const newDrive = new VaccinationDrive({
      vaccinationId: uuidv4(),
      driveName,
      location,
      startDate,
      endDate,
      vaccinesAvailable,
      slotsAvailable,
      gradesAvailable, // Include gradesAvailable in the drive object
    });

    await newDrive.save();
    res.status(201).json(newDrive);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating vaccination drive", error });
  }
});

//@desc update vaccination drive
//@route PUT /api/vaccination/:vaccinationId
//@access private
const updateVaccinationDrive = asyncHandler(async (req, res) => {
  try {
    const updatedDrive = await VaccinationDrive.findOneAndUpdate(
      { vaccinationId: req.params.vaccinationId },
      req.body,
      { new: true }
    );
    if (!updatedDrive) {
      return res.status(404).json({ message: "Vaccination Drive not found" });
    }
    res.status(200).json(updatedDrive);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating vaccination drive", error });
  }
});

//@desc delete vaccination drive
//@route DELETE /api/vaccination/:vaccinationId
//@access private
const deleteVaccinationDrive = asyncHandler(async (req, res) => {
  try {
    const deletedDrive = await VaccinationDrive.findOneAndDelete({
      vaccinationId: req.params.vaccinationId,
    });
    if (!deletedDrive) {
      return res.status(404).json({ message: "Vaccination Drive not found" });
    }
    res.status(200).json({ message: "Vaccination Drive deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting vaccination drive", error });
  }
});

module.exports = {
  getVaccinationDrive,
  getSingleVaccinationDrive,
  createVaccinationDrive,
  updateVaccinationDrive,
  deleteVaccinationDrive,
};
