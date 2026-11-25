import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import apiRoutes from './routes/apiRoutes.js';
import { releaseExpiredHolds } from './services/seatHoldService.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }
});

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);
app.use(express.json());

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'CinePulse Flash-Sale API' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
});

app.use('/api', apiRoutes);

setInterval(releaseExpiredHolds, 5000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 MVC Backend running on http://localhost:${PORT}`);
});
