import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import apiRoutes from './routes/apiRoutes.js';
import { releaseExpiredHolds } from './controllers/showController.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// Attach Socket.io to req so controllers can broadcast real-time updates
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Mount API Routes
app.use('/api', apiRoutes);

// Background job: release expired 5-minute seat holds every 5 seconds
setInterval(releaseExpiredHolds, 5000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 MVC Backend running on http://localhost:${PORT}`);
});
