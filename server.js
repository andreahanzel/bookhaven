import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import { initDb } from './config/database.js';
import bodyParser from 'body-parser';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';

import MongoStore from 'connect-mongo';

const app = express();
const port = process.env.PORT || 3000;

// Trust proxy to ensure secure cookies work correctly on Render
app.set('trust proxy', 1);

app.use(bodyParser.json());

// Updated session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
      secure: true, // Set to true since you're using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    },
    name: 'sessionId'
  })
);

// CORS - Allow only Render
app.use(
  cors({
    origin: ['https://bookhaven-api-npvi.onrender.com'], // Only allow Render domain
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Global Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://bookhaven-api-npvi.onrender.com');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

// Use router for all routes
app.use('/', router);

// Error handling middleware
app.use(errorHandler);

initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node running on port ${port}`);
    });
  }
});
