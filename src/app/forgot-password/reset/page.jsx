'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/updatePassword', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include" ,
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      localStorage.removeItem('resetEmail'); 


      // Success → go to login
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] px-4">
      <div className="w-full max-w-md bg-[#1b1b1e] border border-white/10 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Reset Your Password
        </h1>

        {error && (
          <div className="mb-4 text-red-500 bg-red-500/10 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#0d0d0f] text-white border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-[#f02e65]"
              placeholder="Enter your new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f02e65] hover:bg-[#d82555] text-white py-2 px-4 rounded transition duration-200 flex justify-center"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
