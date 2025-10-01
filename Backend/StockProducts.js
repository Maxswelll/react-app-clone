// backend/seed.js
const { Pool } = require("pg");
const StockProducts =
  require("../src/app/admin/components/StockProducts").default;

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
    for (let p of StockProducts) {
      await pool.query(
        `INSERT INTO  stockproducts
          (id, name, buy_price, sell_price, price, size, stock, status, type, image)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           buy_price = EXCLUDED.buy_price,
           sell_price = EXCLUDED.sell_price,
           price = EXCLUDED.price,
            size = EXCLUDED.size,
            stock = EXCLUDED.stock,
            status =EXCLUDED.status,
           type = EXCLUDED.type,
           image = EXCLUDED.image`,
        [
          p.id,
          p.name,
          p.buyPrice || null,
          p.sellPrice || null,
          p.Price,
          p.Size,
          p.stock || null,
          p.status || null,
          p.type || null,
          p.image || null,
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
