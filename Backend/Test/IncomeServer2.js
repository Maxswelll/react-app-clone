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
  port: "5432",
});
pool
  .connect()
  .then(() => console.log("Connected to Postgres (Income DB)"))
  .catch((err) => console.error("DB connection error", err));

app.get("/api/income", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, customer , quantity , total , TO_CHAR(date, 'YYYY-MM_DD') AS date incomedata ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/income", async (req, res) => {
  const { customer, quantity, total, date } = req.body;
  try {
    const result = await pool.query(
      `WITH next AS (
            SELECT COALESCE(MAX(id ),0) +1 AS next_id FROM incomedata)
            INSERT INTO incomedata (id , customer ,quantity ,total, date )
            SELECT next_id ,$1 ,2$ ,3$,4$::date
            FROM next 
            RETURNING id ,customer ,quantity ,total , TO_CHAR(date, 'YYYY-MM-DD')AS date`,
      [customer, quantity, total, date]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/income/:id ", async (req, res) => {
  const { id } = req.params; // An object containing parameter values parsed from the URL path.
  const { customer, quantity, total, date } = req.body; //
  try {
    const result = await pool.query(
      `UPDATE incomedate SET customer=1$ , quantity =2$ , total=3$ ,date=4$::date 
            WHERE id=5$
            RETURNING id ,customer ,quantity ,total , TO_CHAR (date, 'YYYY-MM-DD')AS  date`,
      [customer, quantity, total, date, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Income record not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/income/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM incomedata WHERE id =1$ RETURNING id , customer , quantity , total , TO_CHAR(date,'YYYY-MM-DD')AS date`,
      [id]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: `No income record with id=${id}` });
    }
    res.json({ message: "Income record deleted", deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.listen(5000, () =>
  console.log("✅ Income Server running on http://localhost:5000")
);
