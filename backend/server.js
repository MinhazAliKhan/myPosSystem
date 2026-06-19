const envFile = process.env.NODE_ENV === "production"
  ? ".env.production"
  : ".env.development";

require('dotenv').config({ path: envFile });

const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const mongoose = require('mongoose');

const connectDb = require('./utils/db');
const errorMiddleware = require('./middlewares/error-middleware');

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;
const corsOrigin = isProduction ? process.env.CLIENT_URL : 'http://localhost:5173';

// ----------------------
// Middlewares
// ----------------------
app.set('trust proxy', 1);
app.disable("x-powered-by");
const allowedOrigin = process.env.NODE_ENV === "production" 
  ? "https://mcdposfrontend.onrender.com" 
  : "http://localhost:5173"; // আপনার লোকাল ফ্রন্টএন্ড পোর্ট (যেমন: 5173 বা 3000)

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (isProduction) {
  app.use(compression());
} else {
  app.use(morgan("dev"));
}

// ----------------------
// Routes
// ----------------------

// Health check
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(dbState === 1 ? 200 : 503).json({ 
    status: dbState === 1 ? "UP" : "DOWN",
    timestamp: new Date()
  });
});

// Auth & Master Data Routes
app.use("/api/auth", require('./route/authRoutes'));
app.use("/api/v1/categories", require("./route/category.route"));
app.use("/api/v1/brands", require("./route/brand.route"));
app.use("/api/v1/units", require("./route/unit.route"));
app.use("/api/v1/products", require("./route/product.route"));

// POS Core Routes (Shifts and Sales)
app.use("/api/v1/shifts", require("./route/shift.route"));
app.use("/api/v1/sales", require("./route/sale.route"));
app.use("/api/v1/waste", require("./route/waste.route"));
app.use("/api/v1/suppliers", require("./route/supplier.route"));
app.use("/api/v1/purchases", require("./route/purchase.route"));
app.use("/api/v1/expenses", require("./route/expense.route"));
app.use("/api/v1/reports", require("./route/report.route"));
// ----------------------
// Error middleware
// ----------------------
app.use(errorMiddleware);

// ----------------------
// Start server
// ----------------------
connectDb()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode at http://localhost:${PORT}`)
    )
  )
  .catch((err) => {
    console.error("🔥 Fatal DB connection error:", err.message);
    process.exit(1);
  });