import dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import { requestLogger } from './requestLogger';
import { errorHandler } from './errorHandler';
import logger from './logger';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3300;
// Allow requests from specific origins
app.use(cors({
  origin:  ['http://localhost:3000', 'http://localhost:5000'], // Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // If cookies or authentication headers are involved
}));

// Middleware
app.use(express.json());
// Log all incoming requests and responses
app.use(requestLogger);
// app.use(morgan('combined')); // Log all requests

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler for logging and sending error response
app.use(errorHandler);

const uri = process.env.MONGO_URI;
console.log("process.env.MONGO_URI: ", uri);

// MongoDB Connection
mongoose
  .connect(uri as string, { serverApi: { version: '1', strict: true, deprecationErrors: true } })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.error('Error whileconnecting to MongoDB: ', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  process.on('uncaughtException', function (err) {
      console.error("Uncaught Exception error: ", err.stack);
  });
});