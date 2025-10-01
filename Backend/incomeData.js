// backend/seed.js
const { Pool } = require("pg");
const IncomeData = require("../src/app/admin/components/IncomeData").default;

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
    for (let p of IncomeData) {
      await pool.query(
        `INSERT INTO  incomedata
        (id ,customer,quantity,total,date )
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (id) DO UPDATE SET
           customer = EXCLUDED.customer,
           quantity = EXCLUDED.quantity,
           total= EXCLUDED.total,
           date = EXCLUDED.date`,
        [
          p.id,
          p.customer,
          p.quantity || null, // 👈 fallback to 0
          p.total || null,
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
