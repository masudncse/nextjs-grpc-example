"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Link from "next/link";

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchPosts();
  }, [limit]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?limit=${limit}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setPosts(data);
        setError(null);
      }
    } catch (error) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <Navigation />

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Posts</h1>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="input w-32"
            >
              <option value="5">5 posts</option>
              <option value="10">10 posts</option>
              <option value="20">20 posts</option>
              <option value="50">50 posts</option>
            </select>
          </div>

          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 line-clamp-2">{post.body}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Post ID: {post.id} • User ID: {post.userId}{" "}
                    <Link href={`/posts/${post.id}`} className="block">
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
