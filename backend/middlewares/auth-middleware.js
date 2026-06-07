const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    // ১. টোকেন খোঁজা (প্রথমে কুকি থেকে, না থাকলে হেডার থেকে)
    let token = req.cookies[process.env.ACCESS_COOKIE_NAME];

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // ২. টোকেন ভেরিফাই করা
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    
    // ৩. ইউজারের ডাটা রিকোয়েস্টে সেট করা (id এবং role)
    req.user = { id: decoded.id, role: decoded.role }; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};

/**
 * ডাইনামিক রোল চেকার
 * ব্যবহারের নিয়ম: allowRoles("Admin", "Salesman")
 */
exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Access restricted to ${roles.join(" or ")}` 
      });
    }
    next();
  };
};

// exports.isAdmin = (req, res, next) => {
//   if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden: Admin only" });
//   next();
// };

// exports.isManager = (req, res, next) => {
//   if (req.user.role !== "MANAGER") return res.status(403).json({ message: "Forbidden: Manager only" });
//   next();
// };

// exports.isSalesman = (req, res, next) => {
//   if (req.user.role !== "SALESMAN") return res.status(403).json({ message: "Forbidden: Salesman only" });
//   next();
// };
