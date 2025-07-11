// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",       // 🔥 Automatically works on localhost AND Vercel
  withCredentials: true, // 🔐 Cookie bhejne ke liye zaruri hai
});

export default api;
