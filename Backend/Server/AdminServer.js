// Server/AdminServer.js
import express from "express";
import pkg from "pg";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "SuperStrongSecretKey";

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BabyOutFit",
  password: "12345678",
  port: 5432,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL (AdminServer)"))
  .catch((err) => console.error("❌ Database connection error:", err));

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  try {
    // Check if username already exists
    const checkUser = await pool.query(
      "SELECT * FROM admins WHERE username=$1",
      [username]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //  Control role: only allow "user" by default
    // Prevent anyone from creating an "admin" through signup
    const assignedRole = "user";

    // Insert new user into the DB
    const result = await pool.query(
      "INSERT INTO admins (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
      [username, password, assignedRole]
    );

    res.json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});
// Login API
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  try {
    const result = await pool.query("SELECT * FROM admins WHERE username=$1", [
      username,
    ]);

    if (result.rows.length === 0)
      return res.status(401).json({ message: "Invalid username or password" });

    const user = result.rows[0];

    if (password !== user.password)
      return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const messages = {};
    if (user.role === "admin") {
      messages.admin = `Welcome Admin ${user.username}`;
    }
    messages.user = `Welcome ${user.username} (${user.role})`;

    res.json({
      message: "Login successful",
      token,
      expiresIn: "1h",
      username: user.username,
      role: user.role,
      messages,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}

// Routes
router.get("/admin", authenticateToken, adminOnly, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}` });
});

router.get("/user", authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username} (${req.user.role})` });
});

export default router;
