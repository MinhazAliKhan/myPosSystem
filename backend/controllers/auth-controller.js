const User = require("../models/User");
const jwt = require("jsonwebtoken");

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  // প্রোডাকশনে হলে true, লোকালহোস্টে হলে false
  secure: process.env.NODE_ENV === "production", 
  // প্রোডাকশনে 'none', লোকালহোস্টে 'lax' বা 'none'
  sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
  path: "/",
};
const createAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_SECRET, { expiresIn: process.env.ACCESS_EXPIRE || "15m" });

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRE || "7d" });

exports.registerUser = async (req, res, next) => {
  try {
    const { userName, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ userName, email, phone, password, role });
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie(process.env.ACCESS_COOKIE_NAME || "access_token", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
       .cookie(process.env.REFRESH_COOKIE_NAME || "refresh_token", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
       .status(201).json({ message: "User registered", user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie(process.env.ACCESS_COOKIE_NAME || "access_token", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
       .cookie(process.env.REFRESH_COOKIE_NAME || "refresh_token", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
       .status(200).json({ message: "Login successful", user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.REFRESH_COOKIE_NAME || "refresh_token"];
    if (!token) return res.status(401).json({ message: "No refresh token" });
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User no longer exists" });

    const newAccessToken = createAccessToken(user);
    res.cookie(process.env.ACCESS_COOKIE_NAME || "access_token", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
       .status(200).json({ message: "Access token refreshed" });
  } catch (err) { return res.status(401).json({ message: "Refresh token expired or invalid" }); }
};

exports.logout = (req, res) => {
  res.clearCookie(process.env.ACCESS_COOKIE_NAME || "access_token", cookieOptions)
     .clearCookie(process.env.REFRESH_COOKIE_NAME || "refresh_token", cookieOptions)
     .status(200).json({ message: "Logged out successfully" });
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) { next(err); }
};