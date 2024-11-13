"use strict";
/* eslint-disable prettier/prettier */
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const serverless_1 = require("@neondatabase/serverless");
async function POST(request) {
    try {
        const body = await request.json();
        const { origin_address, destination_address, origin_latitude, origin_longitude, destination_latitude, destination_longitude, fare_price, driver_id, user_id, clerk_id, } = body;
        if (!origin_address ||
            !destination_address ||
            !origin_latitude ||
            !origin_longitude ||
            !destination_latitude ||
            !destination_longitude ||
            !driver_id ||
            !user_id ||
            !clerk_id) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const response = await sql `
        INSERT INTO notifications ( 
          origin_address, 
          destination_address, 
          origin_latitude, 
          origin_longitude, 
          destination_latitude, 
          destination_longitude, 
          fare_price,
          driver_id, 
          user_id,
          clerk_id,
          created_at
        ) VALUES (
          ${origin_address},
          ${destination_address},
          ${origin_latitude},
          ${origin_longitude},
          ${destination_latitude},
          ${destination_longitude},
          ${fare_price},
          ${driver_id},
          ${user_id},
          ${clerk_id},
          NOW()
        )
        RETURNING *;
        `;
        return Response.json({ data: response[0] }, { status: 201 });
    }
    catch (error) {
        console.error("Error inserting data into recent_rides:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}