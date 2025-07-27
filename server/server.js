const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Vite dev
        "https://static.line-scdn.net", // LINE LIFF SDK
        "https://d.line-scdn.net", // LINE CDN
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Tailwind
      ],
      connectSrc: [
        "'self'",
        "https://api.line.me", // LINE API
        "https://access.line.me", // LINE Login
        process.env.CLIENT_URL || "http://localhost:5173",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:", // Allow all HTTPS images
      ],
      fontSrc: [
        "'self'",
        "https:",
      ],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for LINE integration
}));

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173", // Local development
  "https://follow-the-money-v3-client.onrender.com", // Production
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Follow the Money Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/groups", require("./routes/groups"));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/expenses', require('./routes/expenses'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/follow-the-money"
    );
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.log("⚠️  Server will continue without MongoDB connection");
  }
};

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
};

startServer().catch(console.error);
