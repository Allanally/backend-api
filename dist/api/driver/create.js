"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
/* eslint-disable prettier/prettier */
const serverless_1 = require("@neondatabase/serverless");
async function GET() {
    try {
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const response = await sql `SELECT * FROM drivers WHERE is_active = TRUE`;
        console.log(response);
        return Response.json({ data: response });
    }
    catch (error) {
        return Response.json({ error: error });
    }
}
async function POST(request) {
    try {
        const sql = (0, serverless_1.neon)(`${process.env.DATABASE_URL}`);
        const { legalname, email, phonenumber, password, nationalid, drivingpermit, profilePicture, address, vehicle, seats, clerkId, price, role } = await request.json();
        console.log('Request body:', { legalname, email, phonenumber, password, nationalid, drivingpermit, profilePicture, address, vehicle, seats, clerkId, role });
        if (!legalname || !email || !phonenumber || !password || !nationalid || !drivingpermit || !vehicle || !seats || !clerkId || !price || !role) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const response = await sql `
      INSERT INTO drivers (legalname, email, phonenumber, password, nationalid, drivingpermit, profile_picture, address, vehicle, seats, clerkid, price, role) 
      VALUES (${legalname}, ${email}, ${phonenumber}, ${password}, ${nationalid}, ${drivingpermit}, ${profilePicture}, ${address}, ${vehicle}, ${seats}, ${clerkId}, ${price}, ${role})
    `;
        console.log("Insert response:", response);
        return new Response(JSON.stringify({ data: response }), { status: 201 });
    }
    catch (error) {
        console.error(error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
