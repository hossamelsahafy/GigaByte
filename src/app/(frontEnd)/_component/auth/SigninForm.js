"use client";
import { useState } from "react";
import Link from "next/link";

const SigninForm = ({ isLogin, hasAgreed, setHasAgreed, openPolicyModal }) => {
  return (
    <form className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        className="bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md"
      />

      <input
        type="password"
        placeholder="Password"
        className="bg-[var(--secondary-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-2 rounded-md"
      />

      {isLogin && (
        <Link
          href="/auth/forgot-password"
          className="text-sm text-[var(--hover-color)] hover:underline text-right"
        >
          Forgot Password?
        </Link>
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
        disabled={!isLogin && !hasAgreed}
        className="bg-[var(--accent-color)] text-[var(--background-color)] p-2 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--hover-color)] transition-colors"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>
    </form>
  );
};

export default SigninForm;
