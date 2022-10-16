"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_init_queries_1 = __importDefault(require("./queries/db-init-queries"));
const dotenv_1 = require("dotenv");
const pg_1 = require("pg");
(0, dotenv_1.config)();
// Initialize the database if it has not been created.
// This should only be called with the npm script "db-init", and not used in the app.
// Intended as a helper for local development, production will use a docker container with initialization from the compose file.
(function initDb() {
    return __awaiter(this, void 0, void 0, function* () {
        // Connect to default database
        let pool = new pg_1.Pool({
            user: process.env.DB_USER,
            password: process.env.PASSWORD,
            database: "postgres",
            host: process.env.HOST,
            port: parseInt(process.env.PORT) || 5432,
        });
        // Create new database
        yield pool.query("CREATE DATABASE " + process.env.DATABASE);
        // Connect to new database
        pool = new pg_1.Pool({
            user: process.env.DB_USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            host: process.env.HOST,
            port: parseInt(process.env.PORT) || 5432,
        });
        // Create required tables
        yield pool.query(db_init_queries_1.default.initImageTable, (err, res) => {
            if (err)
                console.error(err);
            else
                console.log("Image table initialized");
        });
        yield pool.query(db_init_queries_1.default.initUsersTable, (err, res) => {
            if (err)
                console.error(err);
            else
                console.log("User table initialized");
        });
        console.log("Databases and tables initialized...");
    });
})();
