import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DIGITAL_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false } 
    : false, 
});

export const connectDB = async (): Promise<void> => {
  try {
    if (!client.connect) {
      await client.connect();
      console.log("✅ Connected to PostgreSQL database");
    }
  } catch (error) {
    console.error("❌ Error connecting to PostgreSQL:", error);
    throw error; 
  }
};


export const disconnectDB = async (): Promise<void> => {
  try {
    await client.end();
    console.log("🚪 Disconnected from PostgreSQL database");
  } catch (error) {
    console.error("❌ Error disconnecting from PostgreSQL:", error);
  }
};

export const queryDatabase = async (query: string, values: any[] = []): Promise<any> => {
  try {
    await connectDB();
    const result = await client.query(query, values);
    return result.rows; 
  } catch (error) {
    console.error("❌ Error executing query:", error);
    throw error;
  }
};

process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit();
});

process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit();
});
