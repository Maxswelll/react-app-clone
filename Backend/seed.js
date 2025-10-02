// backend/seed.js
const { Pool } = require("pg");
const items = require("../src/app/admin/components/items").default;
// make sure this path is correct

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
    for (let p of items) {
      await pool.query(
        `INSERT INTO items 
          (id, name, type, buy_price, sell_price, discount,stock,status, sizes, image)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           type = EXCLUDED.type,
           buy_price = EXCLUDED.buy_price,
           sell_price = EXCLUDED.sell_price,
           discount = EXCLUDED.discount,
           stock = EXCLUDED.stock,
           status=EXCLUDED.status,
           sizes = EXCLUDED.sizes,
           image = EXCLUDED.image`,
        [
          p.id,
          p.name,
          p.type,
          p.buy_price,
          p.sell_price,
          p.discount || null,
          p.stock,
          p.status,
          p.sizes,
          p.image,
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
