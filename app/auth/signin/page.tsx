"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignIn() {
  useEffect(() => {
    signIn("spotify", { callbackUrl: "/workout" });
  }, []);

  return <div>Redirecting to Spotify login...</div>;
}
