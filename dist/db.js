"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryDatabase = exports.disconnectDB = exports.connectDB = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DATABASE_URL = process.env.DIGITAL_DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}
const client = new pg_1.Client({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
});
const connectDB = async () => {
    try {
        if (!client.connect) {
            await client.connect();
            console.log("✅ Connected to PostgreSQL database");
        }
    }
    catch (error) {
        console.error("❌ Error connecting to PostgreSQL:", error);
        throw error;
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await client.end();
        console.log("🚪 Disconnected from PostgreSQL database");
    }
    catch (error) {
        console.error("❌ Error disconnecting from PostgreSQL:", error);
    }
};
exports.disconnectDB = disconnectDB;
const queryDatabase = async (query, values = []) => {
    try {
        await (0, exports.connectDB)();
        const result = await client.query(query, values);
        return result.rows;
    }
    catch (error) {
        console.error("❌ Error executing query:", error);
        throw error;
    }
};
exports.queryDatabase = queryDatabase;
process.on("SIGINT", async () => {
    await (0, exports.disconnectDB)();
    process.exit();
});
process.on("SIGTERM", async () => {
    await (0, exports.disconnectDB)();
    process.exit();
});
