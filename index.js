import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/database.js';

// Import routes
import sessionRoutes from './src/routes/sessionRoutes.js';
import materialRoutes from './src/routes/materialRoutes.js';
import bookedRoutes from './src/routes/bookedRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import noteRoutes from './src/routes/noteRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://study-platform-frontend-azure.vercel.app',
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// API Routes
app.use('/api/v1/session', sessionRoutes);
app.use('/api/v1/material', materialRoutes);
app.use('/api/v1/book-session', bookedRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1/note', noteRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('student platform server is on');
});

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Student server is on ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
