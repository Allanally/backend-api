"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const serverless_1 = require("@neondatabase/serverless");
async function GET(request) {
    try {
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const response = await sql `SELECT * FROM drivers WHERE is_active = TRUE`;
        console.log(response);
        return new Response(JSON.stringify({ data: response }), { status: 200 });
    }
    catch (error) {
        return Response.json({ error: error });
    }
}
