"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("resetEmail");
    if (!saved) {
      alert("No email found! Please restart the flow.");
      return router.push("/forgot-password");
    }
    //console.log(`email from local storage  : ${saved}`);
    
    setEmail(saved);
  }, [router]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await api.post("/auth/verifyOtp", { email, otp }); // ✅ Axios POST

    // Axios parses JSON automatically → use res.data
    if (res.status !== 200) throw new Error(res.data.message || "OTP verification failed");

    router.push("/forgot-password/reset");
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

const handleResend = async () => {
  setResendEnabled(false);
  setTimer(60);
  setError("");

  try {
    const res = await api.post("/auth/verifyOtp", { email }); // ✅ Axios POST

    if (res.status !== 200) throw new Error(res.data.message || "Failed to resend OTP");

    localStorage.removeItem("resetEmail");
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] px-4">
      <div className="w-full max-w-md bg-[#1b1b1e] border border-white/10 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Verify OTP
        </h1>

        {error && (
          <div className="mb-4 text-red-500 bg-red-500/10 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm text-gray-300 mb-1">
              Enter the 6-digit OTP sent to your email
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              required
              maxLength={6}
              pattern="\d{6}"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 bg-[#0d0d0f] text-white border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#f02e65]"
              placeholder="Enter OTP"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-[#f02e65] hover:bg-[#d82555] text-white py-2 px-4 rounded transition duration-200 flex justify-center"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-400">
          {resendEnabled ? (
            <button
              onClick={handleResend}
              className="text-[#f02e65] hover:underline"
            >
              Resend OTP
            </button>
          ) : (
            <p>
              Resend OTP in <span className="text-[#f02e65]">{timer}s</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
