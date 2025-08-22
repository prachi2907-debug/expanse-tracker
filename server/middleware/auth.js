const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    // accept any of these keys from the payload
    req.userId = decoded.id || decoded.userId || decoded._id;
    if (!req.userId) return res.status(401).json({ msg: "Invalid token payload" });
    next();
  } catch (e) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};
