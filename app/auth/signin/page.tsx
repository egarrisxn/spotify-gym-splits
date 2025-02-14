"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function SignIn() {
  useEffect(() => {
    signIn("spotify", { callbackUrl: "/workout" });
  }, []);

  return <div className="p-8 text-center">Redirecting to Spotify login...</div>;
}
