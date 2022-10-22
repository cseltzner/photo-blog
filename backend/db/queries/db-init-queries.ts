import generateId from "../../utils/generateId";

/**
 * Currently only used for local database initialization with db-init.ts
 * This has no use with the Docker setup
 */
const init_db_queries = {
  initDb: `CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`,
  initImageTable:
    "CREATE TABLE IF NOT EXISTS images(id CHAR(10) PRIMARY KEY, cloudinary_public_id VARCHAR(255) NOT NULL, title VARCHAR(255), description TEXT, img_url VARCHAR(1000) NOT NULL, favorite BOOLEAN DEFAULT false, front_page BOOLEAN DEFAULT false, categories TEXT [] )",
  initUsersTable:
    "CREATE TABLE IF NOT EXISTS users(id CHAR(10) PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), role VARCHAR(255))",
  createDefaultAdminUser: (encryptedPassword: string) => {
    return `INSERT INTO users (id, username, password, role) VALUES ('${generateId()}', '${
      process.env.DEFAULT_ADMIN_USERNAME
    }', '${encryptedPassword}', 'admin')`;
  },
};

export default init_db_queries;
