"use strict";
/* eslint-disable prettier/prettier */
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const serverless_1 = require("@neondatabase/serverless");
async function POST(request) {
    try {
        const text = await request.text();
        console.log("Raw received body:", text); // Log the raw body
        const body = JSON.parse(text); // Manually parse to see any issues
        console.log("Parsed body:", body);
        const { origin_address, destination_address, origin_latitude, origin_longitude, destination_latitude, destination_longitude, ride_time, fare_price, payment_status, driver_id, user_id, clerk_id, } = body;
        if (!origin_address ||
            !destination_address ||
            !origin_latitude ||
            !origin_longitude ||
            !destination_latitude ||
            !destination_longitude ||
            !ride_time ||
            !fare_price ||
            !payment_status ||
            !driver_id ||
            !user_id ||
            !clerk_id) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const response = await sql `
        INSERT INTO rides ( 
          origin_address, 
          destination_address, 
          origin_latitude, 
          origin_longitude, 
          destination_latitude, 
          destination_longitude, 
          ride_time, 
          fare_price, 
          payment_status, 
          driver_id, 
          user_id,
          driver_clerk_id
        ) VALUES (
          ${origin_address},
          ${destination_address},
          ${origin_latitude},
          ${origin_longitude},
          ${destination_latitude},
          ${destination_longitude},
          ${ride_time},
          ${fare_price},
          ${payment_status},
          ${driver_id},
          ${user_id},
          ${clerk_id}
        )
        RETURNING *;
        `;
        console.log("Database response:", response);
        return new Response(JSON.stringify({ data: response[0] }), { status: 201 });
    }
    catch (error) {
        console.error("Error inserting data into recent_rides:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
