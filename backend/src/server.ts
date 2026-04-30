import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.routes';
import symptomRoutes from './routes/symptom.routes';
import medicationRoutes from './routes/medication.routes';
import appointmentRoutes from './routes/appointment.routes';
import chatRoutes from './routes/chat.routes';
import reportRoutes from './routes/report.routes';




const app = express();
const PORT = process.env.PORT || 5001;

// Create HTTP server and initialize Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // In production, replace with specific domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Share io instance with Express app
app.set('io', io);
app.use('/uploads', express.static('uploads'));

// Socket.io Middleware for JWT Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: number };
    socket.data.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.user?.id;
  if (userId) {
    const roomName = `room_${userId}`;
    socket.join(roomName);
    console.log(`User ${userId} connected and joined ${roomName}`);

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
