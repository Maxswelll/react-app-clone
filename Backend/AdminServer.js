import express from "express";
import cors from "cors";
import pkg from "pg";
import jwt from "jsonwebtoken";

const { Pool } = pkg;
const app = express();
const PORT = 5003; // your AdminServer port
const JWT_SECRET = "Handsome"; // secret for JWT

// ====================
// Middleware
// ====================
app.use(cors());
app.use(express.json());

// ====================
// PostgreSQL connection
// ====================
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BabyOutFit",
  password: "12345678",
  port: 5432,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL (AdminServer DB)"))
  .catch((err) => console.error("❌ DB connection error", err));

// ====================
// REGISTER ADMIN (no hashing)
// ====================
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, password] // store plain password
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ====================
// LOGIN ADMIN (no hashing)
// ====================
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admins WHERE username=$1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];

    // compare plain password directly
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // ✅ Create JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================
// Protect Routes
// ====================
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ====================
// Example protected route
// ====================
app.get("/api/admin-only", authenticateToken, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}` });
});

// ====================
// Start server
// ====================
app.listen(PORT, () => {
  console.log(`✅ AdminServer running at http://localhost:${PORT}`);
});
