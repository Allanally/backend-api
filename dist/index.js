"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
setInterval(() => {
    console.log("Server is running...");
}, 10000);
const PORT = process.env.PORT || 3000;
async function handler(req, res) {
    const method = req.method || '';
    const url = req.url || '';
    try {
        let response;
        // Driver routes
        if (url.startsWith('/api/driver/create') && method === 'POST') {
            response = await (0, create_1.POST)(new Request(url, { method }));
        }
        else if (url.startsWith('/api/driver/get') && method === 'GET') {
            response = await (0, get_1.GET)();
        }
        else if (/^\/api\/driver\/(\d+)$/.test(url) && method === 'PATCH') {
            const id = url.match(/^\/api\/driver\/(\d+)$/)?.[1];
            if (id) {
                response = await (0, _id_1.PATCH)(new Request(url, { method }), { id });
            }
            else {
                response = new Response(JSON.stringify({ error: 'Invalid driver ID' }), { status: 400 });
            }
        }
        // Notification routes
        else if (url.startsWith('/api/notification/create') && method === 'POST') {
            response = await (0, create_2.POST)(new Request(url, { method }));
        }
        else if (/^\/api\/notification\/(\d+)$/.test(url) && method === 'POST') {
            const notificationId = url.match(/^\/api\/notification\/(\d+)$/)?.[1];
            if (notificationId) {
                response = await (0, _id_2.POST)(new Request(url, { method }), { notificationId });
            }
            else {
                response = new Response(JSON.stringify({ error: 'Invalid notification ID' }), { status: 400 });
            }
        }
        else if (/^\/api\/notification\/(\d+)$/.test(url) && method === 'GET') {
            const notificationId = url.match(/^\/api\/notification\/(\d+)$/)?.[1];
            if (notificationId) {
                response = await (0, _id_2.GET)(new Request(url, { method }), { id: notificationId });
            }
            else {
                response = new Response(JSON.stringify({ error: 'Invalid notification ID' }), { status: 400 });
            }
        }
        else if (url.startsWith('/api/notification/getUnreadNotification') && method === 'POST') {
            response = await (0, getUnreadNotification_1.POST)(new Request(url, { method }));
        }
        else if (url.startsWith('/api/notification/getUserNotificationToken') && method === 'POST') {
            response = await (0, getUserNotificationToken_1.POST)(new Request(url, { method }));
        }
        // User routes
        else if (url.startsWith('/api/user') && method === 'POST') {
            response = await (0, user_1.POST)(new Request(url, { method }));
        }
        else if (url.startsWith('/api/user') && method === 'PATCH') {
            response = await (0, user_1.PATCH)(new Request(url, { method }));
        }
        else if (url.startsWith('/api/user') && method === 'GET') {
            response = await (0, user_1.GET)(new Request(url, { method }));
        }
        // Ride routes
        else if (url.startsWith('/api/ride/create') && method === 'POST') {
            response = await (0, create_3.POST)(new Request(url, { method }));
        }
        else if (url.startsWith('/api/ride/') && method === 'GET') {
            response = await (0, _id_3.POST)(new Request(url, { method }));
        }
        else if (url.startsWith('/api/ride') && method === 'POST') {
            response = await (0, _id_3.POST)(new Request(url, { method }));
        }
        // 404 for unknown routes
        else {
            response = new Response(JSON.stringify({ error: 'Route not found' }), { status: 404 });
        }
        // Transform Headers to a plain object for writeHead
        const headersObj = {};
        response.headers.forEach((value, key) => {
            headersObj[key] = value;
        });
        res.writeHead(response.status, headersObj);
        // Convert ReadableStream body to Buffer and send response
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
const server = http_1.default.createServer(handler);
server.listen(PORT, () => {
    console.log("Server is running on port");
});
