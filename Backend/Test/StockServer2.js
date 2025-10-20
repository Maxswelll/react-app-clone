import express from "express"; //get post put delete
import cors from "cors"; // comm. with front and back
import pkg from "pg"; // db
import multer from "multer"; // store image that uploads
import path from "path";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BabyOutFit",
  password: "12345678",
  port: 5432,
});
pool
  .connect()
  .then(() => console.log("Connected to Postgres"))
  .catch((err) => console.error("DB connection error", err));

app.get("/api/items", async (req, res) => {
  // async this function will do sth slower and it will return a Promise
  //and await will wait for it before moving on
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id ASC");
    const rows = result.rows.map((item) => ({
      //map means go through every items and create news array called rows
      ...item,
      size: Array.isArray(item.sizes)
        ? item.sizes
        : typeof item.sizes === "string"
        ? item.sizes
            .replace(/[{}"']/g, "")
            .split(",")
            .map((s) => s.trim()) //trim means clear the space of the element
        : [],
    }));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/items", upload.single("image"), async (req, res) => {
  const { name, type, buy_price, sell_price, discount, stock, status, sizes } =
    req.body;
  const imagePath = req.file ? `/uploads${req.file.filename}` : null;
  const sizesArray = sizes
    ? sizes
        .replace(/[{}"']/g, "")
        .split(",")
        .map((s) => s.trim())
    : [];

  try {
    const result = await pool.query(
      `WITH next AS (SELECT COALESCE (MAX(id),0)+1 AS next_id FROM items)
      INSERT INTO items (id ,name ,type ,buy_price ,sell_price ,discount ,stock,status,sizes,image)
      SELECT next_id , 1$ ,2$,3$ ,4$ ,5$,6$,7$,8$,9$FROM next RETURNING *`,
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
app.put("/api/items/:id", upload.single("image"), async (req, res) => {
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
  const sizesArray = sizes
    ? sizes
        .replace(/[{}"']/g, "")
        .split(",")
        .map((s) => s.trim())
    : [];
  try {
    const result = await pool.query(
      `UPDATE items 
      SET name=1$, type=2$, buy_price=3$ ,sell_price=4$ ,discount=5$ , stock=6$ ,status=7$ , sizes=8$ , image=9$
      HWERE id=10$ RETURNING *`,
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

app.delete("/api/items/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM items WHERE id=1$ RETURNING *",
      [req.params.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Product Not Found " });
    res.json({ message: "Deleted", deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/api/items/update-stock", async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invaild items array" });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const item of items) {
      const { id, quantity } = item;
      const result = await client.query(
        `UPDATE items 
        SET stock = stock -1$ 
        WHERE id =2$ AND stock >= 1$ 
        RETURNING stock `,
        [quantity, id]
      );
      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ message: `Insufficient stock for item iD ${id}` });
      }
    }
    await client.query("COMMIT"); // commit data into client
    res.json({ success: true, message: "Stock updated successfully" });
  } catch (err) {
    await client.query("ROLLBACK"); //db rollback data to client
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release(); //return the client to the pool
  }
});
app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
