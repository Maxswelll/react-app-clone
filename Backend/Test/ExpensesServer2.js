import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BabyOutFit",
  password: "12345678",
  port: 5432,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL (Expenses DB)"))
  .catch((err) => console.error("❌ DB connection error", err));

app.get("/api/expenses", async (req, res) => {
  try {
    const { type, search, fromDate, toDate } = req.query;

    let query =
      "SELECT id , type , price , description ,TO-CHAR(date,'YYYY-MM-DD')AS date FROM expenses WHERE 1=1";
    const params = [];
    if (type && type !== "All") {
      params.push(type);
      query += `AND type =$${params.length}`;
    }
    if (search && search.trim() !== "") {
      params.push(`%${search}%`);
      query += ` AND (description ILIKE $${params.length} OR type ILIKE $${params.length})`;
    }
    if (fromDate) {
      params.push(fromDate);
      query += ` AND date >= $${params.length}`;
    }

    if (toDate) {
      params.push(toDate);
      query += ` AND date <= $${params.length}`;
    }
    query += "ORDER BY id ASC"; // shortcut of x = x +

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/api/expenses", async (req, res) => {
  const { type, price, description, date } = req.body;

  try {
    const result = await pool.query(
      `WITH next AS (
         SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM expenses
       )
       INSERT INTO expenses
       (id, type, price, description, date)
       SELECT next_id, $1, $2, $3, $4::date
       FROM next
       RETURNING id, type, price, description, TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [type, price, description, date]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.put("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { type, price, description, date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE expenses 
       SET type=$1, price=$2, description=$3, date=$4::date
       WHERE id=$5 
       RETURNING id, type, price, description, TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [type, price, description, date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.delete("/api/expenses/:id", async (req, res) => {
  const { id } = req.params; // .params this object defaults to {}.
  try {
    const result = await pool.query(
      `DELETE FROM expenses 
       WHERE id=$1 
       RETURNING id, type, price, description, TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No expense with id=${id}` });
    }

    res.json({ message: "Expense deleted", deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.listen(5000, () => {
  console.log("Expenses Server running at http://localhost:5000");
});
