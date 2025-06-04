"use client";

import { useState } from "react";

export default function Home() {
  const [grpcReply, setGrpcReply] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const callGrpcHello = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/hello-grpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "World" }),
      });

      const data = await res.json();
      
      if (data.error) {
        setGrpcReply("Error: " + data.error);
      } else {
        setGrpcReply(data.message);
      }
    } catch (err) {
      setGrpcReply(
        "Error calling gRPC endpoint: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Next.js gRPC & Express Example</h1>
      <p>
        Click the button below to call the gRPC server (via Next.js API route).
      </p>
      <button
        disabled={isLoading}
        onClick={callGrpcHello}
        style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
      >
        {isLoading ? "Calling..." : "Call gRPC Hello"}
      </button>
      {grpcReply && (
        <p style={{ marginTop: "1rem" }}>
          Reply: <strong>{grpcReply}</strong>
        </p>
      )}
    </div>
  );
}
