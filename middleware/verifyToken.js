const jwt = require("jsonwebtoken");

const checkAdmin = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // optionally store decoded payload
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = checkAdmin;
