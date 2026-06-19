if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }
const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const connectDb = require('./utils/db');
const errorMiddleware = require('./middlewares/error-middleware');

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1); 

const corsOptions = {
  origin: ['https://mcdposfrontend.onrender.com', 'http://localhost:5173'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (isProduction) { app.use(compression()); } else { app.use(morgan("dev")); }

app.use("/api/auth", require('./route/authRoutes'));
// ... বাকি রাউটগুলো আগের মতোই থাকবে

app.use(errorMiddleware);

connectDb().then(() => app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)));