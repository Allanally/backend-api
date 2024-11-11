/* eslint-disable prettier/prettier */
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;
        console.log("Request Body", userId);
        
        
        const sql = neon(`${process.env.DATABASE_URL}`);
        const response = await sql`
            SELECT expo_notification_token FROM users WHERE clerk_id = ${userId} LIMIT 1;
        `;

        console.log("Full Response:", response); 
        
        const tokenData = response[0]?.expo_notification_token;
        
        console.log("Token Fetched:", tokenData);

        return new Response(JSON.stringify({ expo_notification_token: tokenData }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Error fetching token", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
