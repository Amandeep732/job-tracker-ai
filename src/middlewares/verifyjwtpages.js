import jwt from "jsonwebtoken";

export async function verifyJwtMiddlewarePages(req, res, next) {
    try {
        console.log("🟡 verifyJwtMiddleware pages is running");

        // Get token from cookies or Authorization header
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            console.warn("❌ Token missing");
            return res.status(401).json({ error: "Unauthorized: Token missing" });
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        console.log("✅ Token verified:", decodedToken);

        // Inject user into request
        req.user = { id: decodedToken._id };

        next(); // Continue to next middleware
    } catch (err) {
        console.error("❌ Invalid or expired token:", err.message);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}
