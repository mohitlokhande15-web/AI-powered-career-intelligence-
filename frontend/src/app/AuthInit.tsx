"use client";

import { useEffect, useState } from "react";
import { refreshAccessToken } from "@/lib/api";

export default function AuthInit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const existing = localStorage.getItem("access_token");
      if (!existing) {
        await refreshAccessToken(); // tries the httpOnly cookie
      }
      setReady(true);
    }
    init();
  }, []);

  if (!ready) return null; // or a loading spinner

  return <>{children}</>;
}