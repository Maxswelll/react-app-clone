// mainServer.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import AdminServer from "./Server/AdminServer.js";
import ExpensesServer from "./Server/ExpensesServer.js";
import IncomeServer from "./Server/IncomeServer.js";
import StockServer from "./Server/StockServer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/admin", AdminServer);
app.use("/api/expenses", ExpensesServer);
app.use("/api/income", IncomeServer);
app.use("/api/stock", StockServer);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
