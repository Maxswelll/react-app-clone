// backend/seed.js
const { Pool } = require("pg");
const items = require("../src/pages/Main-page/items").default;
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
        `INSERT INTO products 
          (id, name, type, price, sale_price, discount, in_stock, sizes, image)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           type = EXCLUDED.type,
           price = EXCLUDED.price,
           sale_price = EXCLUDED.sale_price,
           discount = EXCLUDED.discount,
           in_stock = EXCLUDED.in_stock,
           sizes = EXCLUDED.sizes,
           image = EXCLUDED.image`,
        [
          p.id,
          p.name,
          p.type,
          p.price,
          p.salePrice || null,
          p.discount || null,
          p.inStock,
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
