/* eslint-disable prettier/prettier */

import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        // Check if the request has a body
        const contentType = request.headers.get("Content-Type");
        console.log("Content-Type received:", contentType);  // Log the received Content-Type header
        
        if (contentType !== "application/json") {
            return new Response(
                JSON.stringify({ error: "Content-Type must be application/json" }),
                { status: 400 }
            );
        }
        

        const text = await request.text();  // Get the raw body as text
        console.log("Raw received body:", text);  // Log the raw body

        if (!text) {
            console.error("No body content received.");
            return new Response(JSON.stringify({ error: "No body content" }), { status: 400 });
        }

        let body;
        try {
            body = JSON.parse(text);  // Manually parse the body to catch any issues
            console.log("Parsed body:", body);
        } catch (parseError) {
            console.error("Error parsing JSON body:", parseError);
            return new Response(
                JSON.stringify({ error: "Invalid JSON format" }),
                { status: 400 }
            );
        }

        // Destructure the body to get individual parameters
        const {
            origin_address,
            destination_address,
            origin_latitude,
            origin_longitude,
            destination_latitude,
            destination_longitude,
            ride_time,
            fare_price,
            payment_status,
            driver_id,
            user_id,
            clerk_id,
        } = body;

        // Validate required fields
        if (
            !origin_address ||
            !destination_address ||
            !origin_latitude ||
            !origin_longitude ||
            !destination_latitude ||
            !destination_longitude ||
            !ride_time ||
            !fare_price ||
            !payment_status ||
            !driver_id ||
            !user_id ||
            !clerk_id
        ) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        // Insert into the database
        const sql = neon(`${process.env.DATABASE_URL}`);
        const response = await sql`
        INSERT INTO rides ( 
          origin_address, 
          destination_address, 
          origin_latitude, 
          origin_longitude, 
          destination_latitude, 
          destination_longitude, 
          ride_time, 
          fare_price, 
          payment_status, 
          driver_id, 
          user_id,
          driver_clerk_id
        ) VALUES (
          ${origin_address},
          ${destination_address},
          ${origin_latitude},
          ${origin_longitude},
          ${destination_latitude},
          ${destination_longitude},
          ${ride_time},
          ${fare_price},
          ${payment_status},
          ${driver_id},
          ${user_id},
          ${clerk_id}
        )
        RETURNING *;
        `;

        console.log("Database response:", response);
        return new Response(JSON.stringify({ data: response[0] }), { status: 201 });
    } catch (error) {
        console.error("Error inserting data into recent_rides:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
