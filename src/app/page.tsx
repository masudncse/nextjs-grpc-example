"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [grpcReply, setGrpcReply] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [jsonLoading, setJsonLoading] = useState<boolean>(false);
  const [jsonError, setJsonError] = useState<string>("");
  const [singlePost, setSinglePost] = useState<any>(null);
  const [singlePostLoading, setSinglePostLoading] = useState<boolean>(false);
  const [singlePostError, setSinglePostError] = useState<string>("");

  const callGrpcHello = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/hello-grpc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "World" }) });
      const data = await res.json();
      if (data.error) {
         setGrpcReply("Error: " + data.error);
      } else {
         setGrpcReply(data.message);
      }
    } catch (err) {
      setGrpcReply("Error calling gRPC endpoint: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJsonPlaceholder = async () => {
    setJsonLoading(true);
    setJsonError("");
    try {
      const res = await fetch("http://localhost:3001/api/fetch-data");
      if (!res.ok) throw new Error("Failed to fetch data from Express API");
      const data = await res.json();
      setJsonData(data.slice(0, 10)); // Show only first 10 for brevity
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : String(err));
    } finally {
      setJsonLoading(false);
    }
  };

  const fetchSinglePost = async (id: number) => {
    setSinglePostLoading(true);
    setSinglePostError("");
    try {
      const res = await fetch(`http://localhost:3001/api/fetch-data/${id}`);
      if (!res.ok) throw new Error("Failed to fetch single post from Express API");
      const data = await res.json();
      setSinglePost(data);
    } catch (err) {
      setSinglePostError(err instanceof Error ? err.message : String(err));
    } finally {
      setSinglePostLoading(false);
    }
  };

  // Use a useEffect (with an empty dependency array) so that the fetch call (and state update) only runs on the client (and not during SSR).
  useEffect(() => {
    // (Optional: you can remove or comment out the next line if you don't want to auto-call on mount.)
    // callGrpcHello();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Next.js gRPC & Express Example</h1>
      <p>Click the button below to call the gRPC server (via Next.js API route).</p>
      <button disabled={isLoading} onClick={callGrpcHello} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
         {isLoading ? "Calling..." : "Call gRPC Hello"}
      </button>
      {grpcReply && (
         <p style={{ marginTop: "1rem" }}>Reply: <strong>{grpcReply}</strong></p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Fetch Data from Express API (jsonplaceholder)</h2>
      <button disabled={jsonLoading} onClick={fetchJsonPlaceholder} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        {jsonLoading ? "Fetching..." : "Fetch Posts"}
      </button>
      {jsonError && <p style={{ color: 'red' }}>{jsonError}</p>}
      {jsonData.length > 0 && (
        <ul style={{ marginTop: "1rem" }}>
          {jsonData.map(post => (
            <li key={post.id}><strong>{post.title}</strong></li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Fetch a Single Post (by ID) from Express API</h2>
      <button disabled={singlePostLoading} onClick={() => fetchSinglePost(1)} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        {singlePostLoading ? "Fetching..." : "Fetch Post (ID 1)"}
      </button>
      {singlePostError && <p style={{ color: 'red' }}>{singlePostError}</p>}
      {singlePost && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Post (ID: {singlePost.id})</h3>
          <p><strong>Title:</strong> {singlePost.title}</p>
          <p><strong>Body:</strong> {singlePost.body}</p>
        </div>
      )}
    </div>
  );
}
