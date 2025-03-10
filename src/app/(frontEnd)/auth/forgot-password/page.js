"use client";
import { useRouter } from "next/navigation";
import { Router } from "next/router.js";
import { useState } from "react";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const Router = useRouter();

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-reset-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(true);
      setTimeout(() => {
        Router.push("/auth");
      }, 5000);
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
          <p className="text-success text-center">
            Password reset link sent. Check your email.
          </p>
        ) : (
          <form onSubmit={handleSendResetLink}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
