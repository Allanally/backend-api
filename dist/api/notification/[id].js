"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
/* eslint-disable prettier/prettier */
const serverless_1 = require("@neondatabase/serverless");
async function GET(request, { id }) {
    if (!id) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    try {
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const response = await sql `
        SELECT 
            notifications.id,
            notifications.origin_address, 
            notifications.destination_address,
            notifications.origin_latitude,
            notifications.origin_longitude,
            notifications.destination_latitude,
            notifications.destination_longitude,
            notifications.user_id,
            notifications.is_read,
            'driver', json_build_object(
                'driver_id', drivers.id,
                'first_name', drivers.legalname,
                'car_seats', drivers.seats

            ) AS driver 
        FROM 
            notifications
        INNER JOIN 
            drivers ON notifications.driver_id = drivers.id
        WHERE 
            notifications.clerk_id = ${id}
        ORDER BY 
            notifications.created_at DESC;
        `;
        console.log({ response });
        return new Response(JSON.stringify({ data: response }), { headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
async function POST(request, { notificationId }) {
    try {
        const body = await request.json();
        const { notificationId } = body;
        if (!notificationId) {
            console.log("No useId from the backend");
        }
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const response = await sql `
        UPDATE notifications 
        SET is_read = TRUE
        WHERE id = ${notificationId};
        `;
        console.log({ response });
        return new Response(JSON.stringify({ data: response }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (error) {
        console.error("Error saving is_read:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
