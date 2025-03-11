// components/SignOutButton.js
"use client"; // Mark this component as a Client Component

import { signOut } from "next-auth/react";

const SignOutButton = () => {
  const handleSignOut = async () => {
    // Call the API route to sign out
    await fetch("/api/auth/signout", {
      method: "POST",
    });

    // Clear local storage
    localStorage.clear();

    // Clear cookies (you may need to use a library like js-cookie)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Redirect to the home page or login page
    window.location.href = "/";
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
