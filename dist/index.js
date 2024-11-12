"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
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
// Log to indicate server start
console.log("Server is starting...");
// Keep the process alive and log a message every 10 seconds
setInterval(() => {
    console.log("Server is running...");
}, 10000);
async function handler(req) {
    const { method, url } = req;
    //driver
    if (url.startsWith('/api/driver/create') && method === 'POST') {
        return (0, create_1.POST)(req);
    }
    if (url.startsWith('/api/driver/get') && method === 'GET') {
        return (0, get_1.GET)();
    }
    const matchDriverId = url.match(/^\/api\/driver\/(\d+)$/);
    if (matchDriverId && method === 'PATCH') {
        const id = matchDriverId[1];
        return (0, _id_1.PATCH)(req, { id });
    }
    //notification 
    if (url.startsWith('/api/notification/create') && method === 'POST') {
        return (0, create_2.POST)(req);
    }
    const matchNotificationId = url.match(/^\/api\/notification\/(\d+)$/);
    if (matchNotificationId && method === 'POST') {
        const notificationId = matchNotificationId[1];
        return (0, _id_2.POST)(req, { notificationId });
    }
    if (matchNotificationId && method === 'GET') {
        const notificationId = matchNotificationId[1];
        return (0, _id_2.GET)(req, { id: notificationId });
    }
    if (url.startsWith('/api/notification/getUnreadNotification') && method === 'POST') {
        return (0, getUnreadNotification_1.POST)(req);
    }
    if (url.startsWith('/api/notification/getUserNotificationToken') && method === 'POST') {
        return (0, getUserNotificationToken_1.POST)(req);
    }
    //user
    if (url.startsWith('/api/user') && method === 'POST') {
        return (0, user_1.POST)(req);
    }
    if (url.startsWith('/api/user') && method === 'PATCH') {
        return (0, user_1.PATCH)(req);
    }
    if (url.startsWith('/api/user') && method === 'GET') {
        return (0, user_1.GET)(req);
    }
    //ride 
    if (url.startsWith('/api/ride/create') && method === 'POST') {
        return (0, create_3.POST)(req);
    }
    if (url.startsWith('/api/ride') && method === 'GET') {
        return (0, _id_3.POST)(req);
    }
    if (url.startsWith('/api/ride') && method === 'POST') {
        return (0, _id_3.POST)(req);
    }
    return new Response(JSON.stringify({ error: 'Route not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
}
