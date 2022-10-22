# Photography blog

Work in progress. See you soon!

# .Env setup

## /production.env
```dotenv
POSTGRES_PASSWORD= # Password used for postgres database (same as in  /backend/.env)
POSTGRES_DB= # Database name (same as in /backend/.env)
```

## /backend/.env
```dotenv
# Database connection
DB_USER= # Username (should be postgres by default)
PASSWORD= # Password used for postgres database (same as in /production.env)
DATABASE= # Database name (same as in /production.env)
HOST= # Name of postgres container (eg. postgres_db)
PORT= # Port used to connect to db

# Database initialization
# NOT used for docker-compose setup
# These two attributes are only used if running 'npm run db-init' with a local database
DEFAULT_ADMIN_USERNAME= # Username for default admin for the site
DEFAULT_ADMIN_PASSWORD= # Password for default admin for the site

# Server
SERVER_PORT= # Port for server to run on

# Authorization
JWT_SECRET= # JWT secret password.

# Cloudinary api keys
CLOUDINARY_CLOUD_NAME= # Tied to Cloudinary account
CLOUDINARY_API_KEY= # Tied to Cloudinary account
CLOUDINARY_API_SECRET= # Tied to Cloudinary account
CLOUDINARY_UPLOAD_FOLDER_NAME= # Name of folder to store photos into in the Cloudinary asset manager site
```

## /backend/db/init.sql
```sql
-- Make sure you add values between the {} in the "Create default user" statement

-- Initialize image table
CREATE TABLE images(id CHAR(10) PRIMARY KEY, cloudinary_public_id VARCHAR(255) NOT NULL, title VARCHAR(255), description TEXT, img_url VARCHAR(1000) NOT NULL, favorite BOOLEAN DEFAULT false, front_page BOOLEAN DEFAULT false, categories TEXT [] );

-- Initialize users table
CREATE TABLE IF NOT EXISTS users(id CHAR(10) PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), role VARCHAR(255));

-- Create default user
-- You MUST replace values between the {}
-- First value should be some arbitrary length-10 alphanumeric string to serve as an Id
-- Second value should be a username string (eg. 'Admin')
-- Third value should be an encrypted password. Use bcryptjs.hash() to encrypt a password and insert it into the statement
INSERT INTO users (id, username, password, role) VALUES ('{}', '{}', '{}', 'admin')
```