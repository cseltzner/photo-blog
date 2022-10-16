import { config as dotEnvConfig } from "dotenv";
import { Pool } from "pg";

dotEnvConfig();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
  port: parseInt(process.env.PORT!) || 5432,
});

export default pool;
