const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ==============================
// ENV-AWARE COOKIE CONFIG
// ==============================
const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

// ==============================
// TOKEN HELPERS
// ==============================
const createAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_EXPIRE }
  );

const createRefreshToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRE }
  );

// ==============================
// REGISTER
// ==============================
exports.registerUser = async (req, res, next) => {
  try {
    const { userName, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      userName,
      email,
      phone,
      password,
      role,
    });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res
      .cookie(process.env.ACCESS_COOKIE_NAME, accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie(process.env.REFRESH_COOKIE_NAME, refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "User registered",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    next(err);
  }
};

// ==============================
// LOGIN
// ==============================
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res
      .cookie(process.env.ACCESS_COOKIE_NAME, accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie(process.env.REFRESH_COOKIE_NAME, refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    next(err);
  }
};

// ==============================
// REFRESH TOKEN
// ==============================
exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.REFRESH_COOKIE_NAME];
    if (!token)
      return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ message: "User no longer exists" });

    const newAccessToken = createAccessToken(user);

    res
      .cookie(process.env.ACCESS_COOKIE_NAME, newAccessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Access token refreshed" });
  } catch (err) {
    next(err);
  }
};

// ==============================
// LOGOUT
// ==============================
exports.logout = (req, res) => {
  res
    .clearCookie(process.env.ACCESS_COOKIE_NAME, cookieOptions)
    .clearCookie(process.env.REFRESH_COOKIE_NAME, cookieOptions)
    .status(200)
    .json({ message: "Logged out successfully" });
};

// ==============================
// GET PROFILE
// ==============================
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
