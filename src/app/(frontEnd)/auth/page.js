"use client";
import { useState } from "react";
import Link from "next/link";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Privacy from "../_component/auth/privacy.js";
import { motion, AnimatePresence } from "framer-motion";
import SigninForm from "../_component/auth/SigninForm.js";
import SignupForm from "../_component/auth/SignupForm.js";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const Router = useRouter();
  const handleSignInGoogle = async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/account",
      });

      if (result?.error) {
        console.error("Google sign-in failed:", result.error);
      } else {
        Router.replace(result.url || "/account");
      }
    } catch (error) {
      console.error("Error during Google sign-in", error);
    }
  };
  const handleSignInFB = async () => {
    try {
      const result = await signIn("facebook", {
        redirect: false,
        callbackUrl: "/account",
      });

      if (result?.error) {
        console.error("Google sign-in failed:", result.error);
      } else {
        Router.replace(result.url || "/account");
      }
    } catch (error) {
      console.error("Error during Google sign-in", error);
    }
  };

  const openPolicyModal = () => setIsPolicyOpen(true);
  const closePolicyModal = () => setIsPolicyOpen(false);

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--foreground-color)] flex items-center justify-center p-6">
      <div className="bg-[var(--card-bg)] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-[var(--accent-color)] text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={handleSignInGoogle}
            className="bg-[var(--button-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-3 rounded-md flex items-center justify-center gap-3 hover:bg-[#161b22] cursor-pointer transition-colors"
          >
            <FaGoogle className="w-5 h-5 text-red-500 -ml-4" />
            {isLogin ? "Login with Google" : "Sign up with Google"}
          </button>

          <button
            onClick={handleSignInFB}
            className="bg-[var(--button-bg)] text-[var(--foreground-color)] border border-[var(--border-color)] p-3 rounded-md flex items-center justify-center gap-3 hover:bg-[#161b22] cursor-pointer transition-colors"
          >
            <FaFacebook className="w-5 h-5 text-blue-600" />
            {isLogin ? "Login with Facebook" : "Sign up with Facebook"}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-px bg-[var(--border-color)]" />
          <span className="text-[var(--foreground-color)]">OR</span>
          <div className="flex-1 h-px bg-[var(--border-color)]" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isLogin ? (
              <SigninForm
                isLogin={isLogin}
                hasAgreed={hasAgreed}
                setHasAgreed={setHasAgreed}
                openPolicyModal={openPolicyModal}
              />
            ) : (
              <SignupForm
                isLogin={isLogin}
                hasAgreed={hasAgreed}
                setHasAgreed={setHasAgreed}
                openPolicyModal={openPolicyModal}
                setIsLogin={setIsLogin}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <p className="text-center mt-6 text-[var(--foreground-color)]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[var(--hover-color)] hover:underline"
          >
            {isLogin ? "SignUp" : "Login"}
          </button>
        </p>
      </div>

      {isPolicyOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
          <div className="bg-[var(--card-bg)] p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
            <h1 className="text-2xl font-bold text-[var(--accent-color)] mb-4">
              Privacy Policy
            </h1>
            <div className="text-[var(--foreground-color)] space-y-4">
              <Privacy />
            </div>
            <button
              onClick={closePolicyModal}
              className="mt-6 bg-[var(--accent-color)] text-[var(--background-color)] px-4 py-2 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
