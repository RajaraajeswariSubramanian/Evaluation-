const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MCQ Exam Backend with MySQL is running");
});

/* 🔍 Check if empid already attempted */
app.post("/api/score/check", (req, res) => {
  const { empid } = req.body;

  if (!empid) {
    return res.status(400).json({ error: "empid required" });
  }

  const query = "SELECT empid FROM score WHERE empid = ?";
  db.query(query, [empid], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ attempted: results.length > 0 });
  });
});

/* 💾 Save score */
app.post("/api/score", (req, res) => {
  const { empid, score } = req.body;

  if (!empid || score === undefined) {
    return res.status(400).json({ error: "empid and score required" });
  }

  const query = "INSERT INTO score(empid, score) VALUES (?, ?)";
  db.query(query, [empid, score], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Already attempted" });
      }
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Score saved successfully" });
  });
});

/* 📊 Admin: View all results */
app.get("/api/results", (req, res) => {
  db.query("SELECT empid, score, created_at FROM exam_results", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
