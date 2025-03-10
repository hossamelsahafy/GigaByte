"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
const ResetPasswordPage = () => {
  const { token } = useParams();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid password reset link.");
    }
  }, [token, email]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-card-bg p-8 rounded-lg border border-border">
        <h1 className="text-accent text-2xl font-bold text-center mb-6">
          Reset Password
        </h1>

        {success ? (
          <div className="text-center">
            <p className="text-success mb-4">Password reset successfully!</p>
            <Link href="/auth" className="text-hover hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-secondary-bg rounded border border-border
                focus:outline-none focus:border-hover focus:ring-2 focus:ring-hover/20"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-secondary-bg rounded border border-border
                focus:outline-none focus:border-hover focus:ring-2 focus:ring-hover/20"
                required
              />
            </div>

            {error && <p className="text-error mb-4 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-button py-3 px-4 rounded font-medium
              hover:text-[var(--hover-color)] cursor-pointer transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
