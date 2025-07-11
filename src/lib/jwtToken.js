import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
  try {
    // Debug: Log critical variables
    console.log("Token generation started with:", {
      NODE_ENV: process.env.NODE_ENV,
      hasAccessSecret: !!process.env.JWT_ACCESS_SECRET,
      hasRefreshSecret: !!process.env.JWT_REFRESH_SECRET,
      userId: userId,
      userIdType: typeof userId
    });

    // Validate inputs
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets not configured in environment variables");
    }

    if (!userId || typeof userId.toString !== 'function') {
      throw new Error(`Invalid userId: ${userId}`);
    }

    // Convert userId to string if needed
    const userIdStr = userId.toString();

    // Generate tokens with safe defaults
    const accessToken = jwt.sign(
      { id: userIdStr },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m" }
    );

    const refreshToken = jwt.sign(
      { id: userIdStr },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d" }
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