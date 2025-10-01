import { NextResponse } from "next/server";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BabyOutFit",
  password: "12345678",
  port: 5432,
});

export async function POST(req) {
  try {
    const body = await req.json();

    await pool.query(
      `INSERT INTO babyoutfit 
       (name, type, price, sale_price, discount, in_stock, sizes, image) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        body.name,
        body.type,
        body.price,
        body.salePrice,
        body.discount,
        body.inStock,
        body.sizes,
        body.image,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error inserting:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
