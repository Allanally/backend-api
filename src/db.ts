import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true
  } : false, 
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Connection error', error);
    process.exit(1);  
  }
};

const disconnectDB = async () => {
  try {
    await client.end();
    console.log('Disconnected from PostgreSQL database');
  } catch (error) {
    console.error('Error disconnecting', error);
  }
};


connectDB();

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit();
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit();
});

export default client;
