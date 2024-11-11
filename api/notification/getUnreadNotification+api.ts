/* eslint-disable prettier/prettier */
import { neon } from "@neondatabase/serverless";

 export async function POST (request: Request) {
   
    try {
        const body = await request.json();
        const { id } = body;
        const sql = neon(`${process.env.DATABASE_URL}`);
        const [response] = await sql`
        SELECT COUNT(*)::integer as count FROM notifications WHERE clerk_id = ${id} AND is_read = false;
        `
        console.log({response})
        return new Response(JSON.stringify({count: response.count}), {
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        console.error("Error counting notifications:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
 }