"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SigninForm = ({ isLogin, hasAgreed, setHasAgreed, openPolicyModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      router.push("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md"
      />

      {isLogin && (
        <a
          href="/auth/forgot-password"
          className="text-sm text-[var(--hover-color)] hover:underline text-right"
        >
          Forgot Password?
        </a>
      )}

      {!isLogin && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="agree"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
            className="accent-[var(--accent-color)]"
          />
          <label htmlFor="agree" className="text-sm">
            I agree to the{" "}
            <button
              type="button"
              onClick={openPolicyModal}
              className="text-[var(--hover-color)] hover:underline"
            >
              Terms and Privacy Policy
            </button>
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (!isLogin && !hasAgreed)}
        className="bg-[var(--accent-color)] text-[var(--background-color)] p-2 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover-color)] transition-colors"
      >
        {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
      </button>
    </form>
  );
};

export default SigninForm;
