import jwt from "jsonwebtoken";


const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

export const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        {
            id: userId
        },
        ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRY
        }
    );

    const refreshToken = jwt.sign(
        {
            id: userId
        },
        REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRY
    });

    return { accessToken, refreshToken };

}