/* eslint-disable prettier/prettier */
import { neon } from "@neondatabase/serverless"

export async function PATCH(request: Request, {id}: { id: string }) {
    const { is_active } = await request.json();
    
    if (!id)
        return new Response(JSON.stringify({error: "Missing required fields"}), {status: 400, headers: { 'Content-Type': 'application/json' }});
    try {
        const sql = neon(`${process.env.DATABASE_URL}`)
        const response = await sql `
        UPDATE drivers 
            SET is_active = ${is_active}
            WHERE clerkid = ${id}
            RETURNING is_active
        `
        console.log({response})
        return new Response(JSON.stringify({data: response}), {
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
