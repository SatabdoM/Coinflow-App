const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../backend/config");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).json({
      msg: "Invalid Headers",
    });
  }
  const jwtToken = token.split(" ")[1];
  try {
    const verifiedToken = jwt.verify(jwtToken, JWT_SECRET);
    if (verifiedToken) {
      req.userId = verifiedToken.userId;
      next();
    } else {
      return res.status(403).json({
        msg: "you are not authenticated",
      });
    }
  } catch (error) {
    return res.status(403).json({
      msg: "Failed to authorize user",
    });
  }
};

module.exports={
    authMiddleware
}