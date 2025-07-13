import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
  try {
    const token = request.cookies.get("accessToken")?.value || '';
    
    if (!token) {
      throw new Error("No access token found");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    if (!decodedToken.id) {
      throw new Error("Invalid token structure");
    }

    return decodedToken.id;
  } catch (error) {
    console.error("Cannot decode token:", error.message);
    throw new Error(error.message);
  }
};