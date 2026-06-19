// শুধুমাত্র লোকাল ডেভেলপমেন্টের জন্য dotenv ব্যবহার করো
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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

// ----------------------
// Middlewares
// ----------------------
// Render-এর প্রক্সি সার্ভারের জন্য trust proxy 1 থাকা বাধ্যতামূলক
app.set('trust proxy', 1); 

// CORS কনফিগারেশন: ডাইনামিক এবং নিরাপদ
const corsOptions = {
  origin: [
    'https://mcdposfrontend.onrender.com', 
    'http://localhost:5173'
  ],
  credentials: true, // কুকি পাঠানোর জন্য এটি ম্যান্ডেটরি
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.disable("x-powered-by");
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
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

app.use("/api/auth", require('./route/authRoutes'));
app.use("/api/v1/categories", require("./route/category.route"));
app.use("/api/v1/brands", require("./route/brand.route"));
app.use("/api/v1/units", require("./route/unit.route"));
app.use("/api/v1/products", require("./route/product.route"));
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
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    )
  )
  .catch((err) => {
    console.error("🔥 Fatal DB connection error:", err.message);
    process.exit(1);
  });