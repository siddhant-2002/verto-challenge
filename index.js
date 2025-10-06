const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");

const quizRoutes = require("./routes/quizRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/quiz",quizRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server is running on the port ${PORT}`);
});
