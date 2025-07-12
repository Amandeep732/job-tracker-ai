import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
  try {
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets not configured in environment variables");
    }

    const accessExpiry = (process.env.JWT_ACCESS_EXPIRY || "20m").trim().replace(/^"+|"+$/g, "");
    const refreshExpiry = (process.env.JWT_REFRESH_EXPIRY || "7d").trim().replace(/^"+|"+$/g, "");

    console.log("Access expiry value:", accessExpiry);
    console.log("Refresh expiry value:", refreshExpiry);

    if (!userId || typeof userId.toString !== 'function') {
      throw new Error(`Invalid userId: ${userId}`);
    }

    const userIdStr = userId.toString();

    const accessToken = jwt.sign(
      { id: userIdStr },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: accessExpiry }
    );

    const refreshToken = jwt.sign(
      { id: userIdStr },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: refreshExpiry }
    );

    return { accessToken, refreshToken };

  } catch (error) {
    console.error("❌ CRITICAL TOKEN GENERATION FAILURE:", {
      error: error.message,
      stack: error.stack,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRETS_AVAILABLE: {
          access: !!process.env.JWT_ACCESS_SECRET,
          refresh: !!process.env.JWT_REFRESH_SECRET
        }
      },
      input: {
        originalUserId: userId,
        userIdType: typeof userId
      }
    });
    throw new Error("Token generation failed. Check server logs.");
  }
};
