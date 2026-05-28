import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import travelRouter from './routes/travel';
import chatbotRouter from './routes/chatbot';
import safetyRouter from './routes/safety';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: "OK", service: "SoloSafiri India API", time: new Date().toISOString() });
});

app.use('/api', travelRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/safety', safetyRouter);

io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    socket.on('join', (userId: string) => {
        socket.join(`user_${userId}`);
        socket.emit('joined', { userId, message: 'Connected to real-time server' });
    });
    
    socket.on('location-update', (data) => {
        socket.to(`user_${data.userId}`).emit('location-broadcast', data);
        socket.broadcast.emit('traveler-location', {
            userId: data.userId,
            lat: data.lat,
            lng: data.lng,
            timestamp: new Date().toISOString()
        });
    });
    
    socket.on('sos-alert', (data) => {
        io.emit('emergency-alert', {
            ...data,
            timestamp: new Date().toISOString()
        });
    });
    
    socket.on('chat-message', (data) => {
        socket.to(`chat_${data.roomId}`).emit('new-message', data);
    });
    
    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 SoloSafiri API Server running on port ${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/health`);
    console.log(`🌐 Base Route endpoint: http://localhost:${PORT}/api/cities`);
    console.log(`🔌 Socket.IO Real-time server enabled\n`);
});
