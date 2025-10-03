// server.js
import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

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
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection error", err));

// ====================
// 📦 PRODUCTS API
// ====================

// Get items with filters
app.get("/api/items", async (req, res) => {
  try {
    const { type, status, search } = req.query;

    let query = "SELECT * FROM items WHERE 1=1";
    const params = [];

    if (type && type !== "All") {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }

    if (status && status !== "All") {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (search && search.trim() !== "") {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR type ILIKE $${params.length})`;
    }

    query += " ORDER BY id ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add product
app.post("/api/items", async (req, res) => {
  const {
    name,
    type,
    buy_price,
    sell_price,
    discount,
    stock,
    status,
    sizes,
    image,
  } = req.body;

  try {
    const result = await pool.query(
      `WITH next AS (
         SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM items
       )
       INSERT INTO items
       (id, name, type, buy_price, sell_price, discount, stock, status, sizes, image)
       SELECT next_id, $1, $2, $3, $4, $5, $6, $7, $8, $9
       FROM next
       RETURNING *`,
      [name, type, buy_price, sell_price, discount, stock, status, sizes, image]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product
app.put("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    type,
    buy_price,
    sell_price,
    discount,
    stock,
    status,
    sizes,
    image,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE items 
       SET name=$1, type=$2, buy_price=$3, sell_price=$4, discount=$5, stock=$6, status=$7, sizes=$8, image=$9
       WHERE id=$10 RETURNING *`,
      [
        name,
        type,
        buy_price,
        sell_price,
        discount,
        stock,
        status,
        sizes,
        image,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product
app.delete("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM items WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No product with id=${id}` });
    }

    res.json({ message: "Product deleted", deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});
