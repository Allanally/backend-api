import { POST } from './api/driver/create'   
import { GET } from './api/driver/get'        
import { PATCH } from './api/driver/[id]'
import { POST as createNotification } from './api/notification/create'                                
import { POST as updateNotificationStatus, GET as getNotifications } from './api/notification/[id]'         
import { POST as getUnreadNotificationCount } from './api/notification/getUnreadNotification' 
import { POST as getUserNotificationToken } from './api/notification/getUserNotificationToken'
import { POST as createUser, PATCH as updateUserToken, GET as getUserData } from './api/user';
import { POST as getRide, POST as updateRide } from './api/ride/[id]';
import { POST as createRide } from './api/ride/create'
import http from 'http';

// Log to indicate server start
console.log("Server is starting...");

setInterval(() => {
    console.log("Server is running...");
}, 10000);

const port = 3000;


export default async function handler(req: Request) {
    const { method, url } = req;

    //driver
    if (url.startsWith('/api/driver/create') && method === 'POST') {
        return POST(req);
    }
    if (url.startsWith('/api/driver/get') && method === 'GET') {
        return GET();
    }
    const matchDriverId = url.match(/^\/api\/driver\/(\d+)$/); 
    if (matchDriverId && method === 'PATCH') {
        const id = matchDriverId[1]; 
        return PATCH(req, { id }); 
    }

    //notification 
    if (url.startsWith('/api/notification/create') && method === 'POST') {
        return createNotification(req);
    }
    const matchNotificationId = url.match(/^\/api\/notification\/(\d+)$/);  
    if (matchNotificationId && method === 'POST') {
        const notificationId = matchNotificationId[1]; 
        return updateNotificationStatus(req, { notificationId });  
    }
    if (matchNotificationId && method === 'GET') {
        const notificationId = matchNotificationId[1];  
        return getNotifications(req, { id: notificationId });  
    }
    if (url.startsWith('/api/notification/getUnreadNotification') && method === 'POST') {
        return getUnreadNotificationCount(req);
    }
    if (url.startsWith('/api/notification/getUserNotificationToken') && method === 'POST') {
        return getUserNotificationToken(req);
    }

    //user
    if (url.startsWith('/api/user') && method === 'POST') {
        return createUser(req);
    }
    if (url.startsWith('/api/user') && method === 'PATCH') {
        return updateUserToken(req);
    }
    if (url.startsWith('/api/user') && method === 'GET') {
        return getUserData(req);
    }

    //ride 
    if (url.startsWith('/api/ride/create') && method === 'POST') {
        return createRide(req);
    }
    if (url.startsWith('/api/ride/') && method === 'GET') {
        return getRide(req);
    }
    if (url.startsWith('/api/ride') && method === 'POST') {
        return updateRide(req);
    }

    return new Response(
        JSON.stringify({ error: 'Route not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
}
