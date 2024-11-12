"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.PATCH = PATCH;
exports.GET = GET;
/* eslint-disable prettier/prettier */
const serverless_1 = require("@neondatabase/serverless");
async function POST(request) {
    try {
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const { name, email, clerkId, role } = await request.json();
        if (!name || !email || !clerkId) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }
        const response = await sql `
      INSERT INTO users (
        name, 
        email, 
        clerk_id,
        role
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId},
        ${role}
     );`;
        return new Response(JSON.stringify({ data: response }), {
            status: 201,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
async function PATCH(request) {
    try {
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const { id, token } = await request.json();
        const response = await sql `
    UPDATE users SET expo_notification_token = ${token} WHERE clerk_id = ${id}
    `;
        return new Response(JSON.stringify({ data: response }), {
            status: 201,
        });
    }
    catch (error) {
        console.error("Error patching token:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
async function GET(request) {
    try {
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        const response = await sql `
    SELECT 
        id,
        legalname,
        email,
        phonenumber,
        nationalid,
        address,
        profile_picture  
        FROM drivers 
        WHERE clerkid = ${id}
    `;
        console.log(response);
        return new Response(JSON.stringify({ data: response }), {
            status: 201,
        });
    }
    catch (error) {
        console.error("Error fetching user data", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
