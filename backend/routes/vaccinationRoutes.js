const express = require("express");
const {
  getVaccinationDrive,
  getSingleVaccinationDrive,
  createVaccinationDrive,
  updateVaccinationDrive,
  deleteVaccinationDrive,
} = require("../controllers/vaccinationController");
const validateToken = require("../middleware/validateTokenHandler");

const vaccinationRouter = express.Router();

vaccinationRouter.use(validateToken);
vaccinationRouter
  .route("/")
  .get(getVaccinationDrive)
  .post(createVaccinationDrive);
vaccinationRouter
  .route("/:vaccinationId")
  .get(getSingleVaccinationDrive)
  .put(updateVaccinationDrive)
  .delete(deleteVaccinationDrive);

module.exports = vaccinationRouter;
