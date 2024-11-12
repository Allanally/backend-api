"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATCH = PATCH;
/* eslint-disable prettier/prettier */
const serverless_1 = require("@neondatabase/serverless");
async function PATCH(request, { id }) {
    const { is_active } = await request.json();
    if (!id)
        return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    try {
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const response = await sql `
        UPDATE drivers 
            SET is_active = ${is_active}
            WHERE clerkid = ${id}
            RETURNING is_active
        `;
        console.log({ response });
        return new Response(JSON.stringify({ data: response }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (error) {
        console.error(error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
