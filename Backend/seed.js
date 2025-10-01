const { Pool } = require("pg");
const items = require("../src/pages/Main-page/items").default;

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
        `INSERT INTO babyoutfit 
         (name, type, price, sale_price, discount, in_stock, sizes, image)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
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
    console.log("✅ Items seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

seed();
