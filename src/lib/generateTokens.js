import { User } from "@/models/user.model"
import { generateTokens } from "./jwtToken";

export const generateAccessandRefreshToken = async function (userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            throw err;
        }

        const { accessToken, refreshToken } = generateTokens(user._id.toString())

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        const err = new Error("❌ Something went wrong while generating tokens");
        err.statusCode = 500;
        throw err;
    }
}