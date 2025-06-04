"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";

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
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <Navigation />
        
        <div className="card">
          <h1 className="text-3xl font-bold mb-4">Next.js gRPC & Express Example</h1>
          <p className="text-gray-600 mb-4">
            Click the button below to call the gRPC server (via Next.js API route).
          </p>
          <button
            disabled={isLoading}
            onClick={callGrpcHello}
            className="btn btn-primary"
          >
            {isLoading ? "Calling..." : "Call gRPC Hello"}
          </button>
          {grpcReply && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-gray-700">
                Reply: <strong className="text-gray-900">{grpcReply}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
