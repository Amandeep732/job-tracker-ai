import jwt from "jsonwebtoken";

export const authenticateUserPages = async (req, res, next) => {
  try {
    // ✅ First priority: Authorization header
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      // ✅ From cookies (after cookie-parser middleware)
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Token not found." });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
};
