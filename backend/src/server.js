require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { connectDB } = require('./config/database');
const { initWebSocket } = require('./utils/websocket');

const isTest = process.env.NODE_ENV === 'test'; 
const { startDeadlineScheduler } = require('./utils/scheduler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes'); // NEW
const adminRoutes = require('./routes/adminRoutes'); // NEW
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Trust proxy headers (needed for express-rate-limit when running behind reverse proxies like Azure App Service)
app.set('trust proxy', 1);

// ── Security middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = (process.env.FRONTEND_URL || 'http://localhost:3000')
      .split(',')
      .map(url => url.trim().replace(/\/$/, ''));
    if (!origin || allowed.includes(origin.trim().replace(/\/$/, ''))) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Helper to extract client IP and strip any port numbers (IPv4/IPv6) added by reverse proxies like Azure
const getClientIp = (req) => {
  let ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  if (ip.includes('[') && ip.includes(']')) {
    const match = ip.match(/\[(.*)\]/);
    if (match) ip = match[1];
  } else if ((ip.match(/:/g) || []).length === 1) {
    ip = ip.split(':')[0];
  }
  return ip;
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { errorCode: 'RATE_LIMIT', message: 'Too many requests, please try again later' },
  keyGenerator: getClientIp,
});
app.use('/api/', limiter);

// Auth endpoint stricter limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { errorCode: 'RATE_LIMIT', message: 'Too many login attempts' },
  keyGenerator: getClientIp,
});
app.use('/api/auth/login', authLimiter);

// ── Body parsing ─────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lazy database connection middleware for Vercel/serverless environments
let isDbConnected = false;
app.use(async (req, res, next) => {
  if (req.path === '/health') return next(); // Skip DB check for simple health check
  if (!isDbConnected && !isTest) {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (err) {
      return next(err);
    }
  }
  next();
});


// ── Static file serving for uploaded attachments ────────────────────
// NOTE: served behind auth via download endpoint, this is just a safety fallback disabled by default
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── API Docs ─────────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ───────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', attachmentRoutes); // NEW - provides /api/tasks/:id/attachments and /api/attachments/:id
app.use('/api/admin', adminRoutes); // NEW
app.use('/api/projects', projectRoutes);

// Health check
// Health check
app.get('/health', async (req, res) => {
  try {
    const { Otp, User } = require('./models');
    const otpsCount = await Otp.count();
    const usersCount = await User.count();
    
    let dbUrlMasked = 'not set';
    if (process.env.DATABASE_URL) {
      dbUrlMasked = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
    }

    res.json({
      status: 'ok',
      time: new Date(),
      databaseUrl: dbUrlMasked,
      dialect: process.env.DB_DIALECT,
      counts: {
        otps: otpsCount,
        users: usersCount
      }
    });
  } catch (err) {
    res.json({
      status: 'error',
      time: new Date(),
      error: err.message,
      stack: err.stack
    });
  }
});

// Seeding endpoint (runs on Vercel environment directly to bypass local firewall blocks)
app.get('/health/seed', async (req, res, next) => {
  try {
    const { User } = require('./models');
    const testUsers = [
      { name: 'Legacy Admin', email: 'admin@tms.com', password: 'Admin@1234', role: 'Admin' },
      { name: 'System Admin', email: 'tasknova.test26@gmail.com', password: 'Admin@1234', role: 'Admin' },
      { name: 'Test Manager', email: 'manager@tms.com', password: 'Manager@1234', role: 'Project Manager' },
      { name: 'Test Collaborator', email: 'collab@tms.com', password: 'Collab@1234', role: 'Collaborator' },
      { name: 'Test Collaborator Legacy', email: 'collaborator@tms.com', password: 'Collab@1234', role: 'Collaborator' },
    ];
    const results = [];
    for (const u of testUsers) {
      const existing = await User.findOne({ where: { email: u.email } });
      if (existing) {
        await existing.update({
          name: u.name,
          password: u.password,
          role: u.role,
          isActive: true,
          mustResetPassword: false,
        });
        results.push(`Updated ${u.role}: ${u.email}`);
      } else {
        await User.create({
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
          mustResetPassword: false,
        });
        results.push(`Created ${u.role}: ${u.email}`);
      }
    }
    res.json({ status: 'success', results });
  } catch (err) {
    console.error('Seeding error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Multer file errors
  if (err.message === 'File type not allowed') {
    return res.status(400).json({ errorCode: 'INVALID_FILE_TYPE', message: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ errorCode: 'FILE_TOO_LARGE', message: 'File exceeds 10MB limit' });
  }

  res.status(500).json({
    errorCode: 'SERVER_ERROR',
    message: 'An unexpected error occurred',
    description: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ── Start server ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

 if (!isTest) {
  initWebSocket(server);
}

if (require.main === module && !process.env.VERCEL) {
  startServer();
}

async function startServer() {
  try {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (dbErr) {
      console.error('⚠️ Database connection failed on startup, will retry on request:', dbErr.message);
    }

    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 API Docs: http://localhost:${PORT}/api/docs\n`);

      // Start the deadline notification scheduler (NEW)
      startDeadlineScheduler();
    });
  } catch (err) {
    console.error('Server failed to start:', err.message);
    process.exit(1);
  }
}

module.exports = app;

// Trigger Azure redeploy with updated PROJECT environment variable
