import express from "express";
import cors from "cors";
import pkg from "pg";
import jwt from "jsonwebtoken";

const { Pool } = pkg;
const app = express();
const PORT = 5003;
const JWT_SECRET = "HandsomeSuperSecretKey"; // ⚠️ Change this in production

// ====================
// Middleware
// ====================
app.use(cors());
app.use(express.json());

// ====================
// PostgreSQL Connection
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
  .catch((err) => console.error("❌ Database connection error:", err));

// ====================
// REGISTER ADMIN (Sign Up)
// ====================
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

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

    // Insert new user (no hashing for now)
    const result = await pool.query(
      "INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, password]
    );

    res.json({
      message: "Admin registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ====================
// LOGIN ADMIN
// ====================
app.post("/api/login", async (req, res) => {
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

    // ✅ Create JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Send token + username to frontend
    res.json({ token, username: user.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ====================
// Middleware: Verify token
// ====================
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

// ====================
// Protected route
// ====================
app.get("/api/admin-only", authenticateToken, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}` });
});

// ====================
// Start Server
// ====================
app.listen(PORT, () => {
  console.log(`✅ AdminServer running at http://localhost:${PORT}`);
});
