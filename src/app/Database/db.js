// src/lib/db.js
import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: "5432",
  user: "postgres",
  database: "BabyOutFit",
  password: "12345678",
});

export default pool;
