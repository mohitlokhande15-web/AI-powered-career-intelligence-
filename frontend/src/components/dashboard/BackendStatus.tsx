"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type HealthResponse = {
  status: string;
  service: string;
};

export default function BackendStatus() {
  const [status, setStatus] = useState("Checking...");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const data = await apiRequest<HealthResponse>("/api/health");

        setStatus(data.status);
        setIsConnected(true);
      } catch {
        setStatus("Unavailable");
        setIsConnected(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm">
      <span
        className={`h-2 w-2 rounded-full ${
          isConnected ? "bg-green-500" : "bg-neutral-300"
        }`}
      />

      <span className="text-neutral-600">
        API {status}
      </span>
    </div>
  );
}