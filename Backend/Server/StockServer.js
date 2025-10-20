// Server/ItemsServer.js
import express from "express";
import pkg from "pg";
import multer from "multer";
import path from "path";

const { Pool } = pkg;
const router = express.Router();

// Middleware (local)
router.use(express.json());

//  Multer setup for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});
const upload = multer({ storage });

//  Serve uploads folder
router.use("/uploads", express.static("uploads"));

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
  .then(() => console.log("✅ Connected to PostgreSQL (ItemsServer)"))
  .catch((err) => console.error("❌ DB connection error", err));

//  PRODUCTS API

// Get all items
router.get("/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id ASC");

    //  Clean sizes safely
    const rows = result.rows.map((item) => ({
      ...item,
      sizes: Array.isArray(item.sizes)
        ? item.sizes
        : typeof item.sizes === "string"
        ? item.sizes
            .replace(/[{}"']/g, "")
            .split(",")
            .map((s) => s.trim())
        : [],
    }));

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Add product
router.post("/items", upload.single("image"), async (req, res) => {
  const { name, type, buy_price, sell_price, discount, stock, status, sizes } =
    req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  //  Clean sizes (no quotes or braces)
  const sizesArray = sizes
    ? sizes
        .replace(/[{}"']/g, "")
        .split(",")
        .map((s) => s.trim())
    : [];

  try {
    const result = await pool.query(
      `WITH next AS (SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM items)
       INSERT INTO items (id, name, type, buy_price, sell_price, discount, stock, status, sizes, image)
       SELECT next_id, $1,$2,$3,$4,$5,$6,$7,$8,$9 FROM next
       RETURNING *`,
      [
        name,
        type,
        buy_price,
        sell_price,
        discount,
        stock,
        status,
        sizesArray,
        imagePath,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//  Update product
router.put("/items/:id", upload.single("image"), async (req, res) => {
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

  const imagePath = req.file ? `/uploads/${req.file.filename}` : image;

  // ✅ Clean sizes
  const sizesArray = sizes
    ? sizes
        .replace(/[{}"']/g, "")
        .split(",")
        .map((s) => s.trim())
    : [];

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
        sizesArray,
        imagePath,
        id,
      ]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//  Delete product
router.delete("/items/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM items WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted", deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Update stock after payment
router.post("/items/update-stock", async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid items array" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const item of items) {
      const { id, quantity } = item;

      // Reduce stock, prevent negative stock
      const result = await client.query(
        `UPDATE items
         SET stock = stock - $1
         WHERE id = $2 AND stock >= $1
         RETURNING stock`,
        [quantity, id]
      );

      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ message: `Insufficient stock for item ID ${id}` });
      }
    }

    await client.query("COMMIT");
    res.json({ success: true, message: "Stock updated successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;
