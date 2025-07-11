"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccessMsg("");

    try {
      const res = await api.post("/auth/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        console.log(data.message);
        throw new Error(data.message || "Something went wrong");
      }
      localStorage.setItem("resetEmail", email);

      setSuccessMsg("OTP sent successfully!");
      setTimeout(() => {
        router.push("/forgot-password/verify-otp");
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#2b0012] px-4">
      <div className="w-full max-w-md bg-[#0e0e0e] border border-white/10 rounded-lg shadow-md p-8">
        <h1 className="text-2xl text-white font-semibold text-center mb-6">
          Forgot Password
        </h1>

        {error && (
          <div className="mb-4 text-red-500 bg-red-500/10 p-3 rounded text-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 text-green-500 bg-green-500/10 p-3 rounded text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] text-white border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#f02e65]"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-[#f02e65] hover:bg-[#d82555] text-white font-medium py-2 px-4 rounded transition duration-200 flex justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                    5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 
                    5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Remembered your password?{" "}
          <a href="/login" className="text-[#f02e65] hover:underline">
            Go to Login
          </a>
        </p>
      </div>
    </div>
  );
}
