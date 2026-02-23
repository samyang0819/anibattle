require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDB } = require("./lib/db");

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const quizRoutes = require("./routes/quiz");
const battleRoutes = require("./routes/battles");
const leaderboardRoutes = require("./routes/leaderboard");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: false }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/battles", battleRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const port = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(port, () => console.log(`Server running on :${port}`));
});

module.exports = app; // for tests
