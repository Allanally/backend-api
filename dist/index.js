"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prettier/prettier */
const create_1 = require("./api/driver/create");
const get_1 = require("./api/driver/get");
const _id_1 = require("./api/driver/[id]");
const create_2 = require("./api/notification/create");
const _id_2 = require("./api/notification/[id]");
const getUnreadNotification_1 = require("./api/notification/getUnreadNotification");
const getUserNotificationToken_1 = require("./api/notification/getUserNotificationToken");
const user_1 = require("./api/user");
const _id_3 = require("./api/ride/[id]");
const create_3 = require("./api/ride/create");
const http_1 = __importDefault(require("http"));
console.log("Server is starting...");
// Periodically log server status
setInterval(() => {
    console.log("Server is running...");
}, 300000);
const PORT = process.env.PORT || 3000;
const BASE_URL = "https://ride-560b930add7e.herokuapp.com";
async function handler(req, res) {
    const method = req.method || '';
    const url = req.url || '';
    try {
        let response;
        // Driver routes
        if (url.startsWith('/api/driver/create') && method === 'POST') {
            response = await (0, create_1.POST)(new Request(`${BASE_URL}${url}`, { method }));
        }
        else if (url.startsWith('/api/driver/get') && method === 'GET') {
            response = await (0, get_1.GET)(new Request(`${BASE_URL}${url}`, { method }));
        }
        else if (/^\/api\/driver\/(\d+)$/.test(url) && method === 'PATCH') {
            const id = url.match(/^\/api\/driver\/(\d+)$/)?.[1];
            if (id) {
                response = await (0, _id_1.PATCH)(new Request(`${BASE_URL}${url}`, { method }), { id });
            }
            else {
                response = new Response(JSON.stringify({ error: 'Invalid driver ID' }), { status: 400 });
            }
        }
        // Notification routes
        else if (url.startsWith('/api/notification/create') && method === 'POST') {
            response = await (0, create_2.POST)(new Request(`${BASE_URL}${url}`, { method }));
        }
        else if (/^\/api\/notification\/(\d+)$/.test(url) && method === 'POST') {
            const notificationId = url.match(/^\/api\/notification\/(\d+)$/)?.[1];
            if (notificationId) {
                response = await (0, _id_2.POST)(new Request(`${BASE_URL}${url}`, { method }), { notificationId });
            }
            else {
                response = new Response(JSON.stringify({ error: 'Invalid notification ID' }), { status: 400 });
            }
        }
        else if (/^\/api\/notification\/(\d+)$/.test(url) && method === 'GET') {
            const notificationId = url.match(/^\/api\/notification\/(\d+)$/)?.[1];
            if (notificationId) {
                response = await (0, _id_2.GET)(new Request(`${BASE_URL}${url}`, { method }), { id: notificationId });
            }
            else {
                response = new Response(JSON.stringify({ error: 'Invalid notification ID' }), { status: 400 });
            }
        }
        else if (url.startsWith('/api/notification/getUnreadNotification') && method === 'POST') {
            response = await (0, getUnreadNotification_1.POST)(new Request(`${BASE_URL}${url}`, { method }));
        }
        else if (url.startsWith('/api/notification/getUserNotificationToken') && method === 'POST') {
            response = await (0, getUserNotificationToken_1.POST)(new Request(`${BASE_URL}${url}`, { method }));
        }
        // User routes
        else if (url.startsWith('/api/user') && method === 'POST') {
            response = await (0, user_1.POST)(new Request(`${BASE_URL}${url}`, { method }));
        }
        else if (url.startsWith('/api/user') && method === 'PATCH') {
            response = await (0, user_1.PATCH)(new Request(`${BASE_URL}${url}`, { method }));
        }
        else if (url.startsWith('/api/user') && method === 'GET') {
            response = await (0, user_1.GET)(new Request(`${BASE_URL}${url}`, { method }));
        }
        // Ride routes
        else if (url.startsWith('/api/ride/create') && method === 'POST') {
            response = await (0, create_3.POST)(new Request(`${BASE_URL}${url}`, { method }));
        }
        else {
            const matchRideId = url.match(/^\/api\/ride\/(\d+)$/);
            if (matchRideId && method === 'GET') {
                const id = matchRideId[1];
                response = await (0, _id_3.POST)(new Request(`${BASE_URL}/api/ride/${id}`, { method }));
            }
            else if (matchRideId && method === 'POST') {
                const id = matchRideId[1];
                response = await (0, _id_3.POST)(new Request(`${BASE_URL}${url}`, {
                    method,
                    body: JSON.stringify({ id }),
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
            else {
                // Route not found
                response = new Response(JSON.stringify({ error: 'Route not found' }), { status: 404 });
            }
        }
        // Set response headers and send response body
        const headersObj = {};
        response.headers.forEach((value, key) => {
            headersObj[key] = value;
        });
        res.writeHead(response.status, headersObj);
        if (response.body) {
            const body = await response.arrayBuffer();
            res.end(Buffer.from(body));
        }
        else {
            res.end();
        }
    }
    catch (error) {
        console.error("Error handling request:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}
// Create and start the server
const server = http_1.default.createServer(handler);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
