const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    let token = req.cookies[process.env.ACCESS_COOKIE_NAME];
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; 
    next();
  } catch (err) { return res.status(401).json({ message: "Invalid or expired access token" }); }
};

exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: Access restricted to ${roles.join(" or ")}` });
    }
    next();
  };
};