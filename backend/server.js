const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");
const vaccinationRouter = require("./routes/vaccinationRoutes");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const reportsRouter = require("./routes/reportRoutes");
const dashboardRouter = require("./routes/dashboardRoute");

connectDb();
const app = express();
const port = process.env.PORT || 3003;

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    credentials: true, // if you're using cookies or auth headers
  })
);

app.use(express.json());
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vaccination", vaccinationRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
