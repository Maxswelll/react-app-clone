// Server/IncomeServer.js
import express from "express";
import pkg from "pg";

const { Pool } = pkg;
const router = express.Router();

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
  .then(() => console.log("✅ Connected to PostgreSQL (IncomeServer)"))
  .catch((err) => console.error("❌ Database connection error:", err));

//  INCOME API

// ✅ Get all income records
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, customer, quantity, total, 
              TO_CHAR(date, 'YYYY-MM-DD') AS date 
       FROM incomedata ORDER BY id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching income data:", err);
    res.status(500).json({ message: err.message });
  }
});

//  Add income record
router.post("/", async (req, res) => {
  const { customer, quantity, total, date } = req.body;
  try {
    const result = await pool.query(
      `WITH next AS (
         SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM incomedata
       )
       INSERT INTO incomedata (id, customer, quantity, total, date)
       SELECT next_id, $1, $2, $3, $4::date
       FROM next
       RETURNING id, customer, quantity, total, TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [customer, quantity, total, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error adding income:", err);
    res.status(400).json({ message: err.message });
  }
});

//  Update income record
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { customer, quantity, total, date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE incomedata 
       SET customer=$1, quantity=$2, total=$3, date=$4::date
       WHERE id=$5
       RETURNING id, customer, quantity, total, TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [customer, quantity, total, date, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Income record not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating income:", err);
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete income record
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM incomedata 
       WHERE id=$1 
       RETURNING id, customer, quantity, total, TO_CHAR(date, 'YYYY-MM-DD') AS date`,
      [id]
    );

    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ message: `No income record with id=${id}` });

    res.json({ message: "Income record deleted", deleted: result.rows[0] });
  } catch (err) {
    console.error("❌ Error deleting income:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
