import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT as string, 10),
});

const checkDBConnection = async () => {
  try {
    await pool.connect();
    console.log("Database connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database connection error:", error.stack);
    } else {
      console.error("Unexpected error during database connection:", error);
    }
  }
};

checkDBConnection();

export default pool;
