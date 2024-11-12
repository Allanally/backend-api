import { POST } from './api/driver/create';   
import { GET } from './api/driver/get';        
import { PATCH } from './api/driver/[id]';
import { POST as createNotification } from './api/notification/create';                                
import { POST as updateNotificationStatus, GET as getNotifications } from './api/notification/[id]';         
import { POST as getUnreadNotificationCount } from './api/notification/getUnreadNotification'; 
import { POST as getUserNotificationToken } from './api/notification/getUserNotificationToken';
import { POST as createUser, PATCH as updateUserToken, GET as getUserData } from './api/user';
import { POST as getRide, POST as updateRide } from './api/ride/[id]';
import { POST as createRide } from './api/ride/create';
import http from 'http';

console.log("Server is starting...");

setInterval(() => {
    console.log("Server is running...");
}, 10000);

const PORT = process.env.PORT || 3000;

async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
    const method = req.method || '';
    const url = req.url || '';

    try {
        let response: Response;

        // Driver routes
        if (url.startsWith('/api/driver/create') && method === 'POST') {
            response = await POST(new Request(url, { method }));
        } else if (url.startsWith('/api/driver/get') && method === 'GET') {
            response = await GET();
        } else if (/^\/api\/driver\/(\d+)$/.test(url) && method === 'PATCH') {
            const id = url.match(/^\/api\/driver\/(\d+)$/)?.[1];
            if (id) {
                response = await PATCH(new Request(url, { method }), { id });
            } else {
                response = new Response(JSON.stringify({ error: 'Invalid driver ID' }), { status: 400 });
            }
        }

        // Notification routes
        else if (url.startsWith('/api/notification/create') && method === 'POST') {
            response = await createNotification(new Request(url, { method }));
        } else if (/^\/api\/notification\/(\d+)$/.test(url) && method === 'POST') {
            const notificationId = url.match(/^\/api\/notification\/(\d+)$/)?.[1];
            if (notificationId) {
                response = await updateNotificationStatus(new Request(url, { method }), { notificationId });
            } else {
                response = new Response(JSON.stringify({ error: 'Invalid notification ID' }), { status: 400 });
            }
        } else if (/^\/api\/notification\/(\d+)$/.test(url) && method === 'GET') {
            const notificationId = url.match(/^\/api\/notification\/(\d+)$/)?.[1];
            if (notificationId) {
                response = await getNotifications(new Request(url, { method }), { id: notificationId });
            } else {
                response = new Response(JSON.stringify({ error: 'Invalid notification ID' }), { status: 400 });
            }
        } else if (url.startsWith('/api/notification/getUnreadNotification') && method === 'POST') {
            response = await getUnreadNotificationCount(new Request(url, { method }));
        } else if (url.startsWith('/api/notification/getUserNotificationToken') && method === 'POST') {
            response = await getUserNotificationToken(new Request(url, { method }));
        }

        // User routes
        else if (url.startsWith('/api/user') && method === 'POST') {
            response = await createUser(new Request(url, { method }));
        } else if (url.startsWith('/api/user') && method === 'PATCH') {
            response = await updateUserToken(new Request(url, { method }));
        } else if (url.startsWith('/api/user') && method === 'GET') {
            response = await getUserData(new Request(url, { method }));
        }

        // Ride routes
        else if (url.startsWith('/api/ride/create') && method === 'POST') {
            response = await createRide(new Request(url, { method }));
        } else if (url.startsWith('/api/ride/') && method === 'GET') {
            response = await getRide(new Request(url, { method }));
        } else if (url.startsWith('/api/ride') && method === 'POST') {
            response = await updateRide(new Request(url, { method }));
        }

        // 404 for unknown routes
        else {
            response = new Response(JSON.stringify({ error: 'Route not found' }), { status: 404 });
        }

        // Transform Headers to a plain object for writeHead
        const headersObj: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            headersObj[key] = value;
        });

        res.writeHead(response.status, headersObj);
        
        // Convert ReadableStream body to Buffer and send response
        if (response.body) {
            const body = await response.arrayBuffer();
            res.end(Buffer.from(body));
        } else {
            res.end();
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

const server = http.createServer(handler);
server.listen(PORT, () => {
    console.log("Server is running on port");
});