// backend/seed.js
const { Pool } = require("pg");
const Expenses = require("../src/app/admin/components/expensesData").default;

// Connect to PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BabyOutFit",
  password: "12345678",
  port: 5432,
});

async function seed() {
  try {
    for (let p of Expenses) {
      await pool.query(
        `INSERT INTO  expenses
        (id , type , price, description,date )
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (id) DO UPDATE SET
           type = EXCLUDED.type,
           price = EXCLUDED.price,
           description= EXCLUDED.description,
           date = EXCLUDED.date`,
        [
          p.id,
          p.type || "Unknown",
          p.price !== undefined ? p.price : 0, // 👈 fallback to 0
          p.description || null,
          p.date || null,
        ]
      );
    }
    console.log("✅ Items inserted/updated successfully!");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    pool.end();
  }
}

seed();
