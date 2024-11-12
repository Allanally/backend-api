"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
/* eslint-disable prettier/prettier */
const serverless_1 = require("@neondatabase/serverless");
async function GET(request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop();
        const role = url.searchParams.get("role");
        if (!id || !role) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        if (role === "user") {
            const response = await sql `
        SELECT
            rides.ride_id,
            rides.origin_address, 
            rides.destination_address,
            rides.origin_latitude,
            rides.origin_longitude,
            rides.destination_latitude,
            rides.destination_longitude,
            rides.ride_time,
            rides.fare_price,
            rides.payment_status,
            rides.created_at,
            rides.is_completed,
            'driver', json_build_object(
                'driver_id', drivers.id,
                'first_name', drivers.legalname,
                'car_seats', drivers.seats
            ) AS driver 
        FROM 
            rides
        INNER JOIN
            drivers ON rides.driver_id = drivers.id
        WHERE 
            rides.user_id = ${id}
        ORDER BY 
            rides.created_at DESC;
        `;
            return new Response(JSON.stringify({ data: response }), { headers: { 'Content-Type': 'application/json' } });
        }
        else if (role === "driver") {
            const rideStats = await sql `
             SELECT 
             COUNT(*)::integer AS ride_count,
             COALESCE(SUM(fare_price)) AS total_fare_price
             FROM 
             rides 
             WHERE 
             driver_clerk_id = ${id};
            `;
            console.log("Driver ride stats", { rideStats });
            return new Response(JSON.stringify({ data: rideStats }), { headers: { 'Content-Type': 'application/json' } });
        }
    }
    catch (error) {
        console.error("Error fetching rides:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { id } = body;
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const response = await sql `
        UPDATE rides 
        SET is_completed = TRUE 
        WHERE ride_id = ${id}
        ;
        `;
        console.log({ response });
        return new Response(JSON.stringify({ data: response }), { headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        console.error("Error completing ride", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
