import { neon } from "@neondatabase/serverless"

export async function GET(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`)
        const response = await sql`SELECT * FROM drivers WHERE is_active = TRUE`
        console.log(response)
        return new Response(JSON.stringify({ data: response }), { status: 200 });
    } catch (error) {
        return Response.json({error: error})
    }
}