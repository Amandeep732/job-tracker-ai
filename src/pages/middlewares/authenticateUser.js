import jwt from "jsonwebtoken"

export const authenticateUserPages = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized. Token not found." });
        }
       // console.log(`authheader is ${authHeader}`);
        const token = authHeader.split(" ")[1];
        //console.log(`token is ${token}`);

        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decodedToken
        next()

    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
}