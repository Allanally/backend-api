"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
/* eslint-disable prettier/prettier */
const serverless_1 = require("@neondatabase/serverless");
async function POST(request) {
    try {
        const body = await request.json();
        const { id } = body;
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const [response] = await sql `
        SELECT COUNT(*)::integer as count FROM notifications WHERE clerk_id = ${id} AND is_read = false;
        `;
        console.log({ response });
        return new Response(JSON.stringify({ count: response.count }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (error) {
        console.error("Error counting notifications:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
