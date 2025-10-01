import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BabyOutFit",
  password: "12345678",
  port: 5432,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection error", err));

// ====================
// 📦 PRODUCTS API
// ====================

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM stockProducts ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add product
app.post("/api/products", async (req, res) => {
  const {
    name,
    buy_price,
    sell_price,
    price,
    size,
    stock,
    status,
    type,
    image,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO stockProducts 
        (name, buy_price, sell_price, price, size, stock, status, type, image)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, buy_price, sell_price, price, size, stock, status, type, image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Update product
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    buy_price,
    sell_price,
    price,
    size,
    stock,
    status,
    type,
    image,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE stockProducts 
       SET name=$1, buy_price=$2, sell_price=$3, price=$4, size=$5, stock=$6, status=$7, type=$8, image=$9
       WHERE id=$10 RETURNING *`,
      [name, buy_price, sell_price, price, size, stock, status, type, image, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM stockProducts WHERE id=$1", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});
