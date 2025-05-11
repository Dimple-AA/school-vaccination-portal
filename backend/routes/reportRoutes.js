const express = require("express");
const { getReports } = require("../controllers/reportsController");
const validateToken = require("../middleware/validateTokenHandler");

const reportsRouter = express.Router();

reportsRouter.use(validateToken);
reportsRouter.route("/vaccinations").get(getReports);

module.exports = reportsRouter;
