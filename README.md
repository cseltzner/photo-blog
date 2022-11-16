# SeltzPort

[SeltzPort.com](https://www.seltzport.com)

# About

SeltzPort is a fullstack NextJS and Express app to be used as my personal photography blog.

My philosophy for this site was to use a modern fullstack environment but otherwise as few non-security libraries as
possible.

My reasoning for this was to force myself to practice solving problems and creating a UI entirely by myself, without
resorting to external libraries to solve problems for me.

As a result, all of the site's styling, animation, and server logic was entirely custom-made by me.

I hope you check out my site and enjoy my photography!

## Stack

I utilized Postgres, Express, React/NextJS, and TailwindCSS. Cloudinary was used as a CDN for my photos.

# Demo the site as an admin!

This site has a built-in feature to demo the full site as an admin to view features such as adding photos, editing/deleting photos, or adding a new user.

If you would like to demo the site as an admin, navigate to /admin/login. On the login page, click the "Sign in as demo admin" button.

You can now visit /admin/upload and /admin/user pages. You can also try to edit and delete photos in the /gallery pages.

If you try to communicate with the backend in the demo user state, the site will throw a network error. This is intentional to avoid demo users from changing site data.

To exit the demo state, click the log out button in the navbar

# Build and run

Create .env files and database initialization scripts [as described in the environment setup section](#environment-setup)

## Development build
```bash
docker-compose -f docker-compose.dev.yml up --build
```

This will spin up the stack. You can visit the NextJS client on localhost:3000

Changes to client will not require a rebuild of the containers, but you will have to refresh the page to see changes

## Production build

### First time SSL initialization

First, comment out the "/" location block in nginx.prod.conf, as indicated by the comment in the file.

Then, run the below command to initialize Nginx and Certbot to work properly

```bash
./init-letsencrypt.sh
```

Now you must un-comment the "/" location block in nginx.prod.conf that you previously commented.

### Starting production stack

```bash
docker-compose up --build
```

This will build and run the app and set up the client on port 80 and 443.

SSL certificates will be automatically created as needed.

# Environment setup

These files will need to be created in the designated folders.

Development environments require a development env file, and production environments require a production env

### /db.production.env and /db/dev.env

```dotenv
POSTGRES_PASSWORD= # Password used for postgres database (same as in  /backend/.env)
POSTGRES_DB= # Database name (same as in /backend/.env)
```

### /backend/production.env and /backend/dev.env

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

### /backend/db/init.sql

```sql
-- Make sure you add values between the {} in the "Create default user" statement

-- Initialize image table
CREATE TABLE images
(
    id                   CHAR(10) PRIMARY KEY,
    cloudinary_public_id VARCHAR(255)  NOT NULL,
    title                VARCHAR(255),
    description          TEXT,
    img_url              VARCHAR(1000) NOT NULL,
    favorite             BOOLEAN DEFAULT false,
    front_page           BOOLEAN DEFAULT false,
    categories           TEXT[]
);

-- Initialize users table
CREATE TABLE IF NOT EXISTS users
(
    id       CHAR(10) PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    role     VARCHAR(255)
);

-- Create default user
-- You MUST replace values between the {}
-- First value should be some arbitrary length-10 alphanumeric string to serve as an Id
-- Second value should be a username string (eg. 'Admin')
-- Third value should be an encrypted password. Use bcryptjs.hash() to encrypt a password and insert it into the statement
INSERT INTO users (id, username, password, role)
VALUES ('{}', '{}', '{}', 'admin')
```