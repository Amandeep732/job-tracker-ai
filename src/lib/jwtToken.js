import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
  try {
    // 1. Validate environment variables
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets not configured");
    }

    // 2. Validate userId
    if (!userId || typeof userId !== "string") {
      throw new Error(`Invalid userId: ${userId}`);
    }

    console.log("Generating tokens with:", {
      accessSecret: !!process.env.JWT_ACCESS_SECRET,
      refreshSecret: !!process.env.JWT_REFRESH_SECRET,
      accessExpiry: process.env.JWT_ACCESS_EXPIRY,
      refreshExpiry: process.env.JWT_REFRESH_EXPIRY,
      userId: userId
    });

    // 3. Generate tokens
    const accessToken = jwt.sign(
      { id: userId },
      process.env.JWT_ACCESS_SECRET,
      { 
        expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m" // Default fallback
      }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      { 
        expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d" // Default fallback
      }
    );

    return { accessToken, refreshToken };

  } catch (error) {
    console.error("❌ Token generation failed:", {
      error: error.message,
      stack: error.stack,
      environment: {
        ACCESS_SECRET: !!process.env.JWT_ACCESS_SECRET,
        REFRESH_SECRET: !!process.env.JWT_REFRESH_SECRET,
        NODE_ENV: process.env.NODE_ENV
      },
      input: {
        userId: userId,
        userIdType: typeof userId
      }
    });
    throw new Error("Token generation failed. Check server logs.");
  }
};