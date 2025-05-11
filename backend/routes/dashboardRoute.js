const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const { getDashboard } = require("../controllers/dashboardController");

const dashboardRouter = express.Router();

dashboardRouter.use(validateToken);
dashboardRouter.route("/").get(getDashboard);

module.exports = dashboardRouter;
