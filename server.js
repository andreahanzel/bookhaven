import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { initDb } from './config/database.js';
import bodyParser from 'body-parser';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GitHubStrategy } from 'passport-github2';
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

app.use(passport.initialize()); // Initialize passport middleware
app.use(passport.session()); // Add passport middleware to express

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

// GitHub strategy configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.CALLBACK_URL || 'https://bookhaven-api-npvi.onrender.com/github/callback'
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        if (!profile || !profile.id) {
          console.error('GitHub authentication failed: No profile received.');
          return done(null, false, { message: 'GitHub authentication failed' });
        }

        console.log('GitHub OAuth callback received:', {
          profileId: profile.id,
          username: profile.username,
          displayName: profile.displayName
        });

        // Create user object
        const user = {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          provider: 'github'
        };

        return done(null, user);
      } catch (error) {
        console.error('Error in GitHub OAuth callback:', error);
        return done(error);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user);
});

// Deserialize user when retrieving session
passport.deserializeUser((user, done) => {
  console.log('Deserializing user:', user);
  done(null, user);
});

// Debug middleware
app.use((req, res, next) => {
  console.log('Session:', {
    isAuthenticated: req.isAuthenticated?.(),
    sessionID: req.sessionID,
    user: req.user?.username
  });
  next();
});

// Debug route
app.get('/debug-session', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    session: req.session
  });
});

// Root route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Logged in as ${req.user.username || req.user.displayName}`);
  } else {
    res.send('Logged out');
  }
});

// Auth status route
app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: req.user
    });
  } else {
    res.json({
      authenticated: false
    });
  }
});

// GitHub callback route
app.get(
  '/github/callback',
  (req, res, next) => {
    console.log('Entering callback route');
    next();
  },
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: true
  }),
  (req, res) => {
    console.log('Authentication successful', {
      user: req.user?.username
    });
    res.redirect('/');
  }
);

// Logout route
app.get('/logout', (req, res, next) => {
  console.log('Logging out user:', req.user?.username);
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return next(err);
      }
      res.redirect('/');
    });
  });
});

// Use router for all routes
app.use('/', router);

// Error handling middleware
app.use(errorHandler);

// TESTING: Added export the app for testing purposes
export { app };

initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node running on port ${port}`);
    });
  }
});
