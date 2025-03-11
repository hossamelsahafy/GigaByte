"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const SignOutButton = () => {
  const router = useRouter();
  const { setName } = useAuth(); // Get the setName function from context

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      await localStorage.removeItem("token");
      setName("SignUp"); // Update the name in context

      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
