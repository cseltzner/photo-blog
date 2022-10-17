import queries from "./queries/db-init-queries";
import { config as dotEnvConfig } from "dotenv";
import { Pool } from "pg";
import bcryptjs from "bcryptjs";

dotEnvConfig();

// Initialize the database if it has not been created.
// This should only be called with the npm script "db-init", and not used in the app.
// Intended as a helper for local development, production will use a docker container with initialization from the compose file.
(async function initDb() {
  // Connect to default database
  let pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: "postgres",
    host: process.env.HOST,
    port: parseInt(process.env.PORT!) || 5432,
  });

  // Create new database
  await pool.query("CREATE DATABASE " + process.env.DATABASE);

  // Connect to new database
  pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: parseInt(process.env.PORT!) || 5432,
  });

  // Create required tables
  await pool.query(queries.initImageTable, (err, res) => {
    if (err) console.error(err);
    else console.log("Image table initialized");
  });

  await pool.query(queries.initUsersTable, async (err, res) => {
    if (err) console.error(err);
    else {
      console.log("User table initialized");
      // Create default administrator //
      // Encrypt password
      const salt = await bcryptjs.genSalt(10);
      const encryptedPassword = await bcryptjs.hash(
        process.env.DEFAULT_ADMIN_PASSWORD!,
        salt
      );

      // Insert default administrator into database
      await pool.query(
        queries.createDefaultAdminUser(encryptedPassword),
        (err, res) => {
          if (err) console.error(err);
          else console.log("Default administrator initialized");
        }
      );
    }
  });
})();
